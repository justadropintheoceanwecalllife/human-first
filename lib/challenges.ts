import type { SubmissionCategory } from '@/types/user';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'touch-grass' | 'make-something' | 'daily-skill' | 'human-connection' | 'random-acts';
  icon: string;
  prompt: string;
}

export const challenges: Challenge[] = [
  // Touch Grass
  {
    id: 'plant-photo',
    title: 'Find a Plant',
    description: 'Take a photo of any plant near you',
    category: 'touch-grass',
    icon: '🌱',
    prompt: 'Show me the best sunset you\'ve seen this week'
  },
  {
    id: 'sky-view',
    title: 'Look Up',
    description: 'Capture the sky from where you are',
    category: 'touch-grass',
    icon: '☁️',
    prompt: 'What view makes you pause during your day?'
  },
  {
    id: 'walk-100',
    title: 'Take 100 Steps',
    description: 'Walk 100 steps, show where you ended up',
    category: 'touch-grass',
    icon: '👣',
    prompt: 'Share something beautiful you noticed today'
  },

  // Make Something
  {
    id: 'origami',
    title: 'Fold Something',
    description: 'Make a simple origami - crane, boat, anything',
    category: 'make-something',
    icon: '🦢',
    prompt: 'Show/draw how you\'re feeling right now'
  },
  {
    id: 'doodle',
    title: 'Doodle Your Mood',
    description: 'Quick 60-second sketch of how you feel',
    category: 'make-something',
    icon: '🎨',
    prompt: 'What made you smile this week?'
  },
  {
    id: 'paper-airplane',
    title: 'Paper Airplane',
    description: 'Fold and fly a paper airplane',
    category: 'make-something',
    icon: '✈️',
    prompt: 'Share something that grounds you when work gets heavy'
  },

  // Daily Skill
  {
    id: 'new-word',
    title: 'Learn a New Word',
    description: 'Say "hello" in a language you don\'t know (voice note)',
    category: 'daily-skill',
    icon: '🗣️',
    prompt: 'What\'s something new you tried recently?'
  },
  {
    id: 'brew-method',
    title: 'Try a New Brew',
    description: 'Make your coffee or tea differently today',
    category: 'daily-skill',
    icon: '☕',
    prompt: 'What\'s your comfort drink today and why?'
  },

  // Human Connection
  {
    id: 'compliment',
    title: 'Give a Compliment',
    description: 'Compliment a colleague, take a photo together',
    category: 'human-connection',
    icon: '💬',
    prompt: 'Share a conversation that stuck with you'
  },
  {
    id: 'lunch-story',
    title: 'Share Your Meal',
    description: 'Photo of what you\'re eating + the story',
    category: 'human-connection',
    icon: '🍜',
    prompt: 'What\'s a kind thing someone did for you recently?'
  },

  // Random Acts
  {
    id: 'made-smile',
    title: 'What Made You Smile',
    description: 'Share something that brought you joy today',
    category: 'random-acts',
    icon: '😊',
    prompt: 'Show something that made you smile today'
  },
  {
    id: 'favorite-mug',
    title: 'Show Your Mug',
    description: 'Photo of your favorite cup/bottle and why',
    category: 'random-acts',
    icon: '☕',
    prompt: 'Share your favorite mug/water bottle'
  },
  {
    id: 'desk-view',
    title: 'Your Workspace',
    description: 'Show what\'s on your desk right now',
    category: 'random-acts',
    icon: '🖥️',
    prompt: 'Show your workspace/what\'s on your desk'
  },
  {
    id: 'phone-wallpaper',
    title: 'Your Wallpaper',
    description: 'Share your phone wallpaper and explain why',
    category: 'random-acts',
    icon: '📱',
    prompt: 'Show your phone wallpaper and explain why'
  },
];

/**
 * Get today's challenge (rotates daily)
 */
export function getTodaysChallenge(): Challenge {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % challenges.length;
  return challenges[index];
}

/**
 * Get challenge by ID
 */
export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id);
}

/**
 * Get challenges by category
 */
export function getChallengesByCategory(category: Challenge['category']): Challenge[] {
  return challenges.filter(c => c.category === category);
}

/**
 * Map challenge ID to submission category
 */
export function getSubmissionCategory(challengeId: string): SubmissionCategory {
  const categoryMap: Record<string, SubmissionCategory> = {
    'plant-photo': 'nature',
    'sky-view': 'nature',
    'walk-100': 'nature',
    'origami': 'creative',
    'doodle': 'creative',
    'paper-airplane': 'creative',
    'new-word': 'selfcare',
    'brew-method': 'food',
    'compliment': 'community',
    'lunch-story': 'food',
    'made-smile': 'selfcare',
    'favorite-mug': 'food',
    'desk-view': 'workspace',
    'phone-wallpaper': 'selfcare',
  };

  return categoryMap[challengeId] || 'selfcare';
}
