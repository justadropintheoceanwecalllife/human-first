'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/singpass';
import { isBulletinAdmin } from '@/lib/adminConfig';
import { getAllBulletinPosts, addBulletinPost, updateBulletinPost, deleteBulletinPost, togglePinPost } from '@/lib/bulletinManager';
import { mockBulletinPosts, type BulletinPost, type BulletinCategory } from '@/types/bulletin';
import Header from '@/components/Header';

const categoryConfig = {
  sig: { label: 'SIG', color: 'bg-jellyfish-pink/30 border-jellyfish-pink/50' },
  cmg: { label: 'CMG', color: 'bg-jellyfish-purple/30 border-jellyfish-purple/50' },
  play: { label: 'Play @ GovTech', color: 'bg-jellyfish-glow/40 border-jellyfish-glow/60' },
  event: { label: 'Event', color: 'bg-sunset/20 border-sunset/40' },
  announcement: { label: 'Announcement', color: 'bg-ocean-light/20 border-ocean-light/40' },
};

export default function BulletinAdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BulletinPost | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BulletinCategory>('announcement');
  const [contactInfo, setContactInfo] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    // Check admin access
    if (!user || !isBulletinAdmin(user.nric, user.email)) {
      router.push('/bulletin');
      return;
    }

    setIsAdmin(true);

    // Load posts - merge localStorage posts with mock posts
    const customPosts = getAllBulletinPosts();
    const allPosts = [...customPosts, ...mockBulletinPosts];
    setPosts(allPosts);
    setIsLoading(false);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPost) {
      // Update existing post
      const updated = updateBulletinPost(editingPost.id, {
        title,
        content,
        category,
        contactInfo,
        isPinned,
      });

      if (updated) {
        setPosts(posts.map(p => p.id === updated.id ? updated : p));
      }
    } else {
      // Add new post
      const newPost = addBulletinPost(title, content, category, contactInfo, isPinned);
      setPosts([newPost, ...posts]);
    }

    // Reset form
    setTitle('');
    setContent('');
    setCategory('announcement');
    setContactInfo('');
    setIsPinned(false);
    setShowAddModal(false);
    setEditingPost(null);
  };

  const handleEdit = (post: BulletinPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setContactInfo(post.contactInfo);
    setIsPinned(post.isPinned);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const success = deleteBulletinPost(id);
    if (success) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = togglePinPost(id);
    if (updated) {
      setPosts(posts.map(p => p.id === updated.id ? updated : p));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingPost(null);
    setTitle('');
    setContent('');
    setCategory('announcement');
    setContactInfo('');
    setIsPinned(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ocean-white font-medium">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header icon="🔧" title="Bulletin Admin" />

      <div className="p-8">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                Manage Bulletin Board
              </h1>
              <p className="text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Create, edit, and manage bulletin posts
              </p>
            </div>
            <motion.button
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              ➕ Add Post
            </motion.button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => {
              const isCustomPost = !mockBulletinPosts.find(p => p.id === post.id);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass p-6 rounded-3xl soft-shadow ${
                    post.isPinned ? 'border-2 border-jellyfish-glow/60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.isPinned && <span className="text-2xl">📌</span>}
                        <h3 className="text-xl font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                          {post.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-ocean-white ${categoryConfig[post.category].color}`}>
                          {categoryConfig[post.category].label}
                        </span>
                        {!isCustomPost && (
                          <span className="px-2 py-1 bg-ocean-white/20 rounded-full text-xs font-bold text-ocean-white/70">
                            Mock
                          </span>
                        )}
                      </div>
                      <p className="text-ocean-white/85 font-medium mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                        {post.content}
                      </p>
                      <p className="text-sm text-ocean-white/70 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                        📞 {post.contactInfo}
                      </p>
                    </div>

                    {/* Admin Controls - Only for custom posts */}
                    {isCustomPost && (
                      <div className="flex flex-col gap-2">
                        <motion.button
                          onClick={() => handleTogglePin(post.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="glass px-4 py-2 rounded-full text-sm font-bold text-ocean-white"
                          title={post.isPinned ? 'Unpin' : 'Pin'}
                        >
                          {post.isPinned ? '📌 Unpin' : '📍 Pin'}
                        </motion.button>
                        <motion.button
                          onClick={() => handleEdit(post)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="glass px-4 py-2 rounded-full text-sm font-bold text-ocean-white"
                        >
                          ✏️ Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(post.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="glass px-4 py-2 rounded-full text-sm font-bold text-ocean-white bg-sunset/20 border border-sunset/40"
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-8 rounded-3xl soft-shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-ocean-white mb-6" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                {editingPost ? 'Edit Post' : 'Add New Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-ocean-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium"
                    placeholder="e.g., Among Us Tournament This Friday!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ocean-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    Content *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none resize-none text-deep-sea font-medium"
                    placeholder="Describe the activity, event, or announcement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ocean-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BulletinCategory)}
                    required
                    className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ocean-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    Contact Info *
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                    className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium"
                    placeholder="e.g., Slack: #gaming, Email: events@tech.gov.sg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="isPinned" className="text-sm font-bold text-ocean-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    📌 Pin this post to the top
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 glass px-8 py-4 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                  >
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-full font-bold text-ocean-white/80 hover:text-ocean-white transition-all"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
