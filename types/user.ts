export interface User {
  anonymousId: string;
  displayName: string;
  realName: string | null;
  department: string | null;
  createdAt: string;
  lastActive: string;
  streakCount: number;
}

export type SubmissionCategory =
  | 'nature'
  | 'workspace'
  | 'food'
  | 'creative'
  | 'pets'
  | 'selfcare'
  | 'community';

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  category: SubmissionCategory;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  icon: string;
}
