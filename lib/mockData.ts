import { User, Submission } from '@/types/user';
import { ChatMessage } from '@/lib/chatManager';
import { generateAnonymousName, generateAnonymousId } from './nameGenerator';

// Mock users for simulation
export const mockUsers: User[] = [
  {
    anonymousId: 'serene-jellyfish-1234',
    displayName: 'Serene Jellyfish',
    realName: null,
    department: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    streakCount: 7,
  },
  {
    anonymousId: 'drifting-cloud-5678',
    displayName: 'Drifting Cloud',
    realName: null,
    department: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    streakCount: 3,
  },
  {
    anonymousId: 'gentle-wave-9012',
    displayName: 'Gentle Wave',
    realName: null,
    department: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    streakCount: 1,
  },
];

// Mock submissions
export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    userId: 'serene-jellyfish-1234',
    challengeId: 'plant-photo',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800',
    caption: 'Found this beautiful succulent on my desk!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-2',
    userId: 'drifting-cloud-5678',
    challengeId: 'plant-photo',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800',
    caption: 'My office plant is thriving 🌱',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-3',
    userId: 'gentle-wave-9012',
    challengeId: 'plant-photo',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
    caption: 'Does a tree outside count? 😅',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-4',
    userId: 'serene-jellyfish-1234',
    challengeId: 'sky-view',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    caption: 'Clear skies today!',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-5',
    userId: 'drifting-cloud-5678',
    challengeId: 'desk-view',
    category: 'workspace',
    imageUrl: 'https://images.unsplash.com/photo-1593642532454-e138e28a63f4?w=800',
    caption: 'My minimal setup - laptop, coffee, and plants',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-6',
    userId: 'gentle-wave-9012',
    challengeId: 'favorite-mug',
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    caption: 'My favorite mug - been using it for 3 years!',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-7',
    userId: 'serene-jellyfish-1234',
    challengeId: 'made-smile',
    category: 'pets',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    caption: 'This random dog I saw during lunch made my day',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-8',
    userId: 'drifting-cloud-5678',
    challengeId: 'origami',
    category: 'creative',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
    caption: 'First attempt at a paper crane! Not perfect but proud',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-9',
    userId: 'gentle-wave-9012',
    challengeId: 'lunch-story',
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    caption: 'Pancakes for breakfast meeting! Best way to start the day',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-10',
    userId: 'serene-jellyfish-1234',
    challengeId: 'doodle',
    category: 'creative',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    caption: 'Quick doodle during a meeting - helps me think!',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    challengeId: 'plant-photo',
    userId: 'serene-jellyfish-1234',
    displayName: 'Serene Jellyfish',
    message: 'Just uploaded my plant pic! Anyone else surprised by how many plants are around us?',
    isAi: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    challengeId: 'plant-photo',
    userId: null,
    message: 'Love that realization! 🌿 What surprised you most about your plant?',
    isAi: true,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-3',
    challengeId: 'plant-photo',
    userId: 'drifting-cloud-5678',
    displayName: 'Drifting Cloud',
    message: 'I totally forgot I had this plant on my desk until today 😂',
    isAi: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-4',
    challengeId: 'plant-photo',
    userId: 'gentle-wave-9012',
    displayName: 'Gentle Wave',
    message: 'I took a pic of a tree outside my window, does that count?',
    isAi: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-5',
    challengeId: 'plant-photo',
    userId: null,
    message: 'Absolutely counts! Trees are plants too 🌳 What kind of tree is it?',
    isAi: true,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
];

// Helper to generate a random mock user
export function generateMockUser(): User {
  return {
    anonymousId: generateAnonymousId(),
    displayName: generateAnonymousName(),
    realName: null,
    department: null,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    streakCount: Math.floor(Math.random() * 10),
  };
}

// Check if we're in mock mode
export function isMockMode(): boolean {
  return typeof window !== 'undefined' && localStorage.getItem('MOCK_MODE') === 'true';
}

// Enable/disable mock mode
export function setMockMode(enabled: boolean) {
  if (typeof window !== 'undefined') {
    if (enabled) {
      localStorage.setItem('MOCK_MODE', 'true');
    } else {
      localStorage.removeItem('MOCK_MODE');
    }
  }
}
