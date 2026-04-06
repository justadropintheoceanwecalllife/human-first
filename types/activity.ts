export type ActivityCategory =
  | 'skills'
  | 'hobbies'
  | 'wellness'
  | 'learning'
  | 'social'
  | 'creative';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string; // e.g., "5 mins", "30 mins", "1 hour"
  icon: string;
  submittedBy: string;
  submittedAt: string;
  upvotes: number;
}

// Mock activities for demo
export const mockActivities: Activity[] = [
  // Skills
  {
    id: 'act-1',
    title: 'Learn Basic Origami',
    description: 'Master the paper crane in 10 minutes. All you need is a square piece of paper.',
    category: 'skills',
    difficulty: 'easy',
    duration: '10 mins',
    icon: '🦢',
    submittedBy: 'Sarah Chua',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 24,
  },
  {
    id: 'act-2',
    title: 'Practice Speed Typing',
    description: 'Use TypeRacer or Monkeytype to improve your WPM. Aim for +5 WPM this week!',
    category: 'skills',
    difficulty: 'easy',
    duration: '15 mins',
    icon: '⌨️',
    submittedBy: 'Kevin Ng',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 18,
  },
  {
    id: 'act-3',
    title: 'Learn a New Language Phrase',
    description: 'Pick a language and learn one useful phrase. Try Duolingo or HelloTalk.',
    category: 'learning',
    difficulty: 'easy',
    duration: '5 mins',
    icon: '🗣️',
    submittedBy: 'Marcus Wong',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 32,
  },

  // Hobbies
  {
    id: 'act-4',
    title: 'Start a Mini Garden',
    description: 'Grow herbs on your desk! Basil, mint, or spring onions are beginner-friendly.',
    category: 'hobbies',
    difficulty: 'medium',
    duration: '30 mins',
    icon: '🌱',
    submittedBy: 'Rachel Koh',
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 28,
  },
  {
    id: 'act-5',
    title: 'Learn 3 Card Tricks',
    description: 'Magic tricks to impress your colleagues during lunch. YouTube has great tutorials.',
    category: 'hobbies',
    difficulty: 'medium',
    duration: '20 mins',
    icon: '🎴',
    submittedBy: 'Daniel Lee',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 15,
  },

  // Wellness
  {
    id: 'act-6',
    title: '5-Minute Desk Stretches',
    description: 'Stretch routine to release tension. Great for between meetings!',
    category: 'wellness',
    difficulty: 'easy',
    duration: '5 mins',
    icon: '🧘',
    submittedBy: 'Jamie Lim',
    submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 42,
  },
  {
    id: 'act-7',
    title: 'Breathing Exercise',
    description: '4-7-8 breathing technique to reduce stress. Breathe in for 4, hold for 7, out for 8.',
    category: 'wellness',
    difficulty: 'easy',
    duration: '3 mins',
    icon: '💨',
    submittedBy: 'Lisa Tan',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 38,
  },

  // Learning
  {
    id: 'act-8',
    title: 'Watch a TED Talk',
    description: 'Pick a random TED talk under 10 minutes. Great coffee break activity.',
    category: 'learning',
    difficulty: 'easy',
    duration: '10 mins',
    icon: '🎥',
    submittedBy: 'Ryan Poh',
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 21,
  },

  // Social
  {
    id: 'act-9',
    title: 'Coffee Chat Roulette',
    description: 'Ask a random colleague out for coffee. Use our Slack bot to find someone new!',
    category: 'social',
    difficulty: 'medium',
    duration: '30 mins',
    icon: '☕',
    submittedBy: 'Alex Tan',
    submittedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 19,
  },
  {
    id: 'act-10',
    title: 'Start a Lunch Walk Club',
    description: 'Invite 2-3 people for a post-lunch walk. Fresh air + networking!',
    category: 'social',
    difficulty: 'easy',
    duration: '20 mins',
    icon: '🚶',
    submittedBy: 'Sarah Chua',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 26,
  },

  // Creative
  {
    id: 'act-11',
    title: 'Doodle Your Day',
    description: 'Sketch your mood or day in 1 minute. No artistic skills needed!',
    category: 'creative',
    difficulty: 'easy',
    duration: '5 mins',
    icon: '✏️',
    submittedBy: 'Marcus Wong',
    submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 17,
  },
  {
    id: 'act-12',
    title: 'Write a Haiku',
    description: 'Create a 5-7-5 syllable poem about your day. Share it in chat!',
    category: 'creative',
    difficulty: 'easy',
    duration: '5 mins',
    icon: '📝',
    submittedBy: 'Kevin Ng',
    submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 14,
  },
];

export const categoryConfig = {
  skills: { label: 'Skills', icon: '🎯', color: 'bg-water-foam/40 border-water-foam/60' },
  hobbies: { label: 'Hobbies', icon: '🎨', color: 'bg-coral/30 border-coral/50' },
  wellness: { label: 'Wellness', icon: '💆', color: 'bg-jellyfish-pink/30 border-jellyfish-pink/50' },
  learning: { label: 'Learning', icon: '📚', color: 'bg-jellyfish-purple/30 border-jellyfish-purple/50' },
  social: { label: 'Social', icon: '👥', color: 'bg-jellyfish-glow/40 border-jellyfish-glow/60' },
  creative: { label: 'Creative', icon: '✨', color: 'bg-sunset/30 border-sunset/50' },
};
