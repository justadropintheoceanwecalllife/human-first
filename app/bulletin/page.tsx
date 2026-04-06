'use client';

import { motion } from 'framer-motion';
import { mockBulletinPosts, type BulletinPost } from '@/types/bulletin';
import Header from '@/components/Header';

const categoryColors = {
  sig: 'bg-jellyfish-pink/30 border-jellyfish-pink/50',
  cmg: 'bg-jellyfish-purple/30 border-jellyfish-purple/50',
  play: 'bg-jellyfish-glow/40 border-jellyfish-glow/60',
  event: 'bg-sunset/20 border-sunset/40',
  announcement: 'bg-ocean-light/20 border-ocean-light/40',
};

const categoryLabels = {
  sig: 'SIG',
  cmg: 'CMG',
  play: 'Play @ GovTech',
  event: 'Event',
  announcement: 'Announcement',
};

export default function Bulletin() {
  const pinnedPosts = mockBulletinPosts.filter(p => p.isPinned);
  const regularPosts = mockBulletinPosts.filter(p => !p.isPinned);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <Header icon="📌" title="Bulletin Board" />

      <div className="p-8">

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-coral/10 blob"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-80 h-80 bg-lavender/10 blob"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Pinned posts */}
        {pinnedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ocean-white mb-6 flex items-center gap-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              <span>📍</span> Pinned
            </h2>
            <div className="space-y-6">
              {pinnedPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} isPinned />
              ))}
            </div>
          </div>
        )}

        {/* Regular posts */}
        <div className="space-y-6">
          {regularPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index + pinnedPosts.length} />
          ))}
        </div>
      </div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center mt-12 pb-8"
      >
        <a
          href="/"
          className="text-sm text-ocean-white/80 font-medium hover:text-ocean-white underline"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          ← Back to home
        </a>
      </motion.div>
      </div>
    </div>
  );
}

function PostCard({ post, index, isPinned = false }: { post: BulletinPost; index: number; isPinned?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass p-8 rounded-3xl soft-shadow hover:glow transition-all ${
        isPinned ? 'border-2 border-sunset/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{post.icon}</span>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-deep-sea">
                  {post.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold text-deep-sea border ${
                    categoryColors[post.category]
                  }`}
                >
                  {categoryLabels[post.category]}
                </span>
              </div>
              <p className="text-sm text-deep-sea-light font-medium">
                by {post.author} • {post.authorRole}
              </p>
            </div>
          </div>

          <p className="text-deep-sea-light font-medium text-lg mb-4 leading-relaxed">
            {post.description}
          </p>

          <div className="flex items-center gap-4">
            {post.ctaText && (
              <motion.a
                href={post.ctaLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-6 py-3 rounded-full font-bold text-deep-sea soft-shadow hover:glow transition-all inline-block"
              >
                {post.ctaText} →
              </motion.a>
            )}
            <p className="text-sm text-deep-sea-light/60 font-medium">
              {getTimeAgo(post.postedAt)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return '1 week ago';
  return `${diffInWeeks} weeks ago`;
}
