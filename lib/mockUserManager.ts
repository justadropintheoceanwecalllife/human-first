import { User, Submission } from '@/types/user';
import { generateAnonymousName, generateAnonymousId } from './nameGenerator';
import { mockSubmissions, mockUsers } from './mockData';
import { getSubmissionCategory } from './challenges';

const USER_STORAGE_KEY = 'mock-user';
const SUBMISSIONS_STORAGE_KEY = 'mock-submissions';

/**
 * Mock version - Get or create user (localStorage only)
 */
export async function getOrCreateUserMock(): Promise<User> {
  if (typeof window === 'undefined') {
    return createMockUser();
  }

  const stored = localStorage.getItem(USER_STORAGE_KEY);

  if (stored) {
    try {
      const user = JSON.parse(stored) as User;
      user.lastActive = new Date().toISOString();
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
  }

  return createMockUser();
}

function createMockUser(): User {
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
 * Mock version - Update user profile
 */
export async function updateUserProfileMock(
  updates: Partial<Pick<User, 'realName' | 'department'>>
): Promise<User> {
  const user = await getOrCreateUserMock();
  const updatedUser = { ...user, ...updates };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  }

  return updatedUser;
}

/**
 * Mock version - Update streak
 */
export async function updateStreakMock(): Promise<User> {
  const user = await getOrCreateUserMock();
  const lastActive = new Date(user.lastActive);
  const now = new Date();
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

  if (hoursSinceActive >= 24 && hoursSinceActive < 48) {
    user.streakCount += 1;
  } else if (hoursSinceActive >= 48) {
    user.streakCount = 1;
  }

  user.lastActive = now.toISOString();

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Mock version - Upload file (converts to data URL)
 */
export async function uploadFileMock(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Mock version - Add submission
 */
export async function addSubmissionMock(
  challengeId: string,
  imageUrl: string,
  caption: string
): Promise<Submission> {
  const user = await getOrCreateUserMock();

  const submission: Submission = {
    id: `sub-${Date.now()}`,
    userId: user.anonymousId,
    challengeId,
    category: getSubmissionCategory(challengeId),
    imageUrl,
    caption,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const submissions = getMockSubmissions();
    submissions.push(submission);
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  }

  return submission;
}

/**
 * Mock version - Get all submissions (includes mock + user submissions)
 */
export async function getAllSubmissionsMock(): Promise<Submission[]> {
  if (typeof window === 'undefined') return mockSubmissions;

  const userSubmissions = getMockSubmissions();
  // Combine mock submissions with user's submissions
  const all = [...mockSubmissions, ...userSubmissions];
  // Sort by date, newest first
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Mock version - Get user submissions
 */
export async function getUserSubmissionsMock(): Promise<Submission[]> {
  if (typeof window === 'undefined') return [];
  return getMockSubmissions();
}

function getMockSubmissions(): Submission[] {
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
