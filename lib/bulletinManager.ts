import { BulletinPost, BulletinCategory } from '@/types/bulletin';

const BULLETIN_STORAGE_KEY = 'bulletin-posts';

/**
 * Get all bulletin posts (from localStorage)
 */
export function getAllBulletinPosts(): BulletinPost[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(BULLETIN_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as BulletinPost[];
  } catch {
    return [];
  }
}

/**
 * Add a new bulletin post
 */
export function addBulletinPost(
  title: string,
  content: string,
  category: BulletinCategory,
  contactInfo: string,
  isPinned: boolean = false
): BulletinPost {
  const posts = getAllBulletinPosts();

  const newPost: BulletinPost = {
    id: `post-${Date.now()}`,
    title,
    content,
    category,
    author: 'Admin',
    contactInfo,
    isPinned,
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  localStorage.setItem(BULLETIN_STORAGE_KEY, JSON.stringify(posts));

  return newPost;
}

/**
 * Update an existing bulletin post
 */
export function updateBulletinPost(
  id: string,
  updates: Partial<Omit<BulletinPost, 'id' | 'createdAt'>>
): BulletinPost | null {
  const posts = getAllBulletinPosts();
  const index = posts.findIndex(p => p.id === id);

  if (index === -1) return null;

  posts[index] = { ...posts[index], ...updates };
  localStorage.setItem(BULLETIN_STORAGE_KEY, JSON.stringify(posts));

  return posts[index];
}

/**
 * Delete a bulletin post
 */
export function deleteBulletinPost(id: string): boolean {
  const posts = getAllBulletinPosts();
  const filtered = posts.filter(p => p.id !== id);

  if (filtered.length === posts.length) return false;

  localStorage.setItem(BULLETIN_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Toggle pin status
 */
export function togglePinPost(id: string): BulletinPost | null {
  const posts = getAllBulletinPosts();
  const post = posts.find(p => p.id === id);

  if (!post) return null;

  return updateBulletinPost(id, { isPinned: !post.isPinned });
}
