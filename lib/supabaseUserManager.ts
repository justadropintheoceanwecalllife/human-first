import { supabase } from './supabase';
import { User, Submission } from '@/types/user';
import { generateAnonymousName, generateAnonymousId } from './nameGenerator';
import { getSubmissionCategory } from './challenges';

const USER_STORAGE_KEY = 'human-first-user-id';

/**
 * Get or create user from Supabase
 */
export async function getOrCreateUser(): Promise<User> {
  // Check if we have a user ID in localStorage
  let anonymousId = localStorage.getItem(USER_STORAGE_KEY);

  if (anonymousId) {
    // Try to fetch existing user from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .single();

    if (data && !error) {
      // Update last active
      await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', data.id);

      return {
        anonymousId: data.anonymous_id,
        displayName: data.display_name,
        realName: data.real_name,
        department: data.department,
        createdAt: data.created_at,
        lastActive: new Date().toISOString(),
        streakCount: data.streak_count,
      };
    }
  }

  // Create new user
  anonymousId = generateAnonymousId();
  const displayName = generateAnonymousName();

  const { data, error } = await supabase
    .from('users')
    .insert({
      anonymous_id: anonymousId,
      display_name: displayName,
      real_name: null,
      department: null,
      last_active: new Date().toISOString(),
      streak_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create user:', error);
    throw error;
  }

  // Store anonymous ID in localStorage
  localStorage.setItem(USER_STORAGE_KEY, anonymousId);

  return {
    anonymousId: data.anonymous_id,
    displayName: data.display_name,
    realName: data.real_name,
    department: data.department,
    createdAt: data.created_at,
    lastActive: data.last_active,
    streakCount: data.streak_count,
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  updates: Partial<Pick<User, 'realName' | 'department'>>
): Promise<User> {
  const anonymousId = localStorage.getItem(USER_STORAGE_KEY);
  if (!anonymousId) throw new Error('No user found');

  const { data, error } = await supabase
    .from('users')
    .update({
      real_name: updates.realName,
      department: updates.department,
    })
    .eq('anonymous_id', anonymousId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }

  return {
    anonymousId: data.anonymous_id,
    displayName: data.display_name,
    realName: data.real_name,
    department: data.department,
    createdAt: data.created_at,
    lastActive: data.last_active,
    streakCount: data.streak_count,
  };
}

/**
 * Get current user's database ID
 */
async function getUserId(): Promise<string | null> {
  const anonymousId = localStorage.getItem(USER_STORAGE_KEY);
  if (!anonymousId) return null;

  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('anonymous_id', anonymousId)
    .single();

  return data?.id || null;
}

/**
 * Update streak count
 */
export async function updateStreak(): Promise<User> {
  const anonymousId = localStorage.getItem(USER_STORAGE_KEY);
  if (!anonymousId) throw new Error('No user found');

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('anonymous_id', anonymousId)
    .single();

  if (!user) throw new Error('User not found');

  const lastActive = new Date(user.last_active);
  const now = new Date();
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

  let newStreakCount = user.streak_count;

  if (hoursSinceActive >= 24 && hoursSinceActive < 48) {
    // Continue streak
    newStreakCount += 1;
  } else if (hoursSinceActive >= 48) {
    // Reset streak
    newStreakCount = 1;
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      streak_count: newStreakCount,
      last_active: now.toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    anonymousId: data.anonymous_id,
    displayName: data.display_name,
    realName: data.real_name,
    department: data.department,
    createdAt: data.created_at,
    lastActive: data.last_active,
    streakCount: data.streak_count,
  };
}

/**
 * Upload image/video to Supabase Storage
 */
export async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('submissions')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  // Get public URL
  const { data } = supabase.storage
    .from('submissions')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Add a submission
 */
export async function addSubmission(
  challengeId: string,
  imageUrl: string,
  caption: string
): Promise<Submission> {
  const userId = await getUserId();
  if (!userId) throw new Error('No user found');

  const category = getSubmissionCategory(challengeId);

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      category: category,
      image_url: imageUrl,
      caption: caption || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to add submission:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    challengeId: data.challenge_id,
    category: data.category,
    imageUrl: data.image_url,
    caption: data.caption || '',
    createdAt: data.created_at,
  };
}

/**
 * Get all submissions (community feed)
 */
export async function getAllSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch submissions:', error);
    return [];
  }

  return data.map(sub => ({
    id: sub.id,
    userId: sub.user_id,
    challengeId: sub.challenge_id,
    category: sub.category,
    imageUrl: sub.image_url,
    caption: sub.caption || '',
    createdAt: sub.created_at,
  }));
}

/**
 * Get user's submissions
 */
export async function getUserSubmissions(): Promise<Submission[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch user submissions:', error);
    return [];
  }

  return data.map(sub => ({
    id: sub.id,
    userId: sub.user_id,
    challengeId: sub.challenge_id,
    category: sub.category,
    imageUrl: sub.image_url,
    caption: sub.caption || '',
    createdAt: sub.created_at,
  }));
}
