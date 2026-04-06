export interface BulletinPost {
  id: string;
  title: string;
  description: string;
  category: 'product' | 'survey' | 'event' | 'announcement' | 'research';
  author: string;
  authorRole: string;
  postedAt: string;
  isPinned: boolean;
  ctaText?: string;
  ctaLink?: string;
  icon: string;
}

export const mockBulletinPosts: BulletinPost[] = [
  {
    id: 'post-1',
    title: 'Help Shape Our Next Feature!',
    description: 'We\'re exploring new ways to support work-life balance across GovTech. Share your thoughts on what would make your workday better.',
    category: 'survey',
    author: 'Sarah Chen',
    authorRole: 'Product Manager, Digital Wellness',
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    ctaText: 'Take Survey (2 min)',
    ctaLink: '#',
    icon: '📊',
  },
  {
    id: 'post-2',
    title: 'New: Weekly Wellness Challenges',
    description: 'Starting next week, we\'re launching themed weekly challenges! From mindfulness Mondays to creative Fridays, there\'s something for everyone.',
    category: 'product',
    author: 'Marcus Tan',
    authorRole: 'Product Owner, Employee Experience',
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    ctaText: 'Learn More',
    ctaLink: '#',
    icon: '🎯',
  },
  {
    id: 'post-3',
    title: 'Coffee Chat Fridays - Join Us!',
    description: 'Every Friday at 3pm, join our virtual coffee break. Meet colleagues from different teams, share what you\'re working on, or just hang out.',
    category: 'event',
    author: 'Lisa Wong',
    authorRole: 'Community Lead',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    ctaText: 'RSVP for This Friday',
    ctaLink: '#',
    icon: '☕',
  },
  {
    id: 'post-4',
    title: 'Research: How AI Affects Your Work',
    description: 'We\'re conducting research on how AI tools impact work-life balance. Your anonymous feedback helps us design better solutions.',
    category: 'research',
    author: 'Dr. Rachel Lim',
    authorRole: 'UX Researcher',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    ctaText: 'Participate (5 min)',
    ctaLink: '#',
    icon: '🔬',
  },
  {
    id: 'post-5',
    title: 'Reminder: Wellness Day Next Friday',
    description: 'Don\'t forget - next Friday is our quarterly Wellness Day. No meetings, take breaks, focus on yourself. Use human-first to connect with colleagues!',
    category: 'announcement',
    author: 'David Ng',
    authorRole: 'Head of People Operations',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    icon: '🌟',
  },
];
