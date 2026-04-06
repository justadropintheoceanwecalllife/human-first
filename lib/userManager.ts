import { User, Submission, Badge } from '@/types/user';
import { generateAnonymousName, generateAnonymousId } from './nameGenerator';

const USER_STORAGE_KEY = 'human-first-user';
const SUBMISSIONS_STORAGE_KEY = 'human-first-submissions';
const BADGES_STORAGE_KEY = 'human-first-badges';

/**
 * Get or create anonymous user
 * Returns existing user from localStorage or creates a new one
 */
export function getOrCreateUser(): User {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return createNewUser();
  }

  const stored = localStorage.getItem(USER_STORAGE_KEY);

  if (stored) {
    try {
      const user = JSON.parse(stored) as User;
      // Update last active
      user.lastActive = new Date().toISOString();
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      return createNewUser();
    }
  }

  return createNewUser();
}

/**
 * Create a new anonymous user
 */
function createNewUser(): User {
  const user: User = {
    anonymousId: generateAnonymousId(),
    displayName: generateAnonymousName(),
    realName: null,
    department: null,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    streakCount: 0,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Update user profile (real name, department)
 */
export function updateUserProfile(updates: Partial<Pick<User, 'realName' | 'department'>>): User {
  const user = getOrCreateUser();
  const updatedUser = { ...user, ...updates };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  }

  return updatedUser;
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch (e) {
    console.error('Failed to parse user:', e);
    return null;
  }
}

/**
 * Update streak count
 */
export function updateStreak(): User {
  const user = getOrCreateUser();
  const lastActive = new Date(user.lastActive);
  const now = new Date();

  // Check if last active was yesterday (within 48 hours to be lenient)
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

  if (hoursSinceActive >= 24 && hoursSinceActive < 48) {
    // Continue streak
    user.streakCount += 1;
  } else if (hoursSinceActive >= 48) {
    // Reset streak
    user.streakCount = 1;
  }
  // If < 24 hours, don't change streak (same day)

  user.lastActive = now.toISOString();

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Get user submissions
 */
export function getUserSubmissions(): Submission[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Submission[];
  } catch (e) {
    console.error('Failed to parse submissions:', e);
    return [];
  }
}

/**
 * Add a new submission
 */
export function addSubmission(submission: Omit<Submission, 'id' | 'createdAt'>): Submission {
  const newSubmission: Submission = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const submissions = getUserSubmissions();
    submissions.push(newSubmission);
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  }

  return newSubmission;
}

/**
 * Get user badges
 */
export function getUserBadges(): Badge[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(BADGES_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Badge[];
  } catch (e) {
    console.error('Failed to parse badges:', e);
    return [];
  }
}

/**
 * Award a badge
 */
export function awardBadge(badge: Omit<Badge, 'earnedAt'>): Badge {
  const newBadge: Badge = {
    ...badge,
    earnedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const badges = getUserBadges();
    // Don't duplicate badges
    if (!badges.find(b => b.id === newBadge.id)) {
      badges.push(newBadge);
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
    }
  }

  return newBadge;
}

/**
 * Check if user has completed today's challenge
 */
export function hasCompletedTodaysChallenge(todayChallengeId: string): boolean {
  const submissions = getUserSubmissions();
  const today = new Date().toDateString();

  return submissions.some(sub => {
    const subDate = new Date(sub.createdAt).toDateString();
    return sub.challengeId === todayChallengeId && subDate === today;
  });
}
