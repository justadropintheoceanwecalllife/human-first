'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllSubmissions, getUserSubmissions } from '@/lib/supabaseUserManager';
import { getAllSubmissionsMock, getUserSubmissionsMock } from '@/lib/mockUserManager';
import { getChallengeById, getTodaysChallenge } from '@/lib/challenges';
import { isVerified } from '@/lib/singpass';
import FeaturedGallery from '@/components/FeaturedGallery';
import UserMenu from '@/components/UserMenu';
import type { Submission, SubmissionCategory } from '@/types/user';

interface SubmissionWithChallenge extends Submission {
  challengeTitle?: string;
  challengeIcon?: string;
}

const categoryConfig = {
  nature: { label: 'Nature & Plants', icon: '🌿', color: 'bg-water-foam/40 border-water-foam/60' },
  workspace: { label: 'Workspace', icon: '💻', color: 'bg-jellyfish-purple/30 border-jellyfish-purple/50' },
  food: { label: 'Food & Drinks', icon: '☕', color: 'bg-sunset/30 border-sunset/50' },
  creative: { label: 'Creative', icon: '🎨', color: 'bg-coral/30 border-coral/50' },
  pets: { label: 'Pets', icon: '🐾', color: 'bg-jellyfish-pink/30 border-jellyfish-pink/50' },
  selfcare: { label: 'Self-Care', icon: '💆', color: 'bg-lavender/30 border-lavender/50' },
  community: { label: 'Community', icon: '👥', color: 'bg-jellyfish-glow/40 border-jellyfish-glow/60' },
};

export default function Feed() {
  const [submissions, setSubmissions] = useState<SubmissionWithChallenge[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<SubmissionCategory | 'all'>('all');
  const challenge = getTodaysChallenge();

  useEffect(() => {
    // Check if user is verified first
    const loadFeed = async () => {
      // If not verified, show onboarding (don't load feed)
      if (!isVerified()) {
        setIsLoading(false);
        return;
      }

      // User is verified, load full feed
      try {
        const userSubs = await getUserSubmissions();
        setUserSubmissions(userSubs);

        const allSubs = await getAllSubmissions();
        const enriched = allSubs.map(sub => {
          const challenge = getChallengeById(sub.challengeId);
          return {
            ...sub,
            challengeTitle: challenge?.title,
            challengeIcon: challenge?.icon,
          };
        });
        setSubmissions(enriched);
        setIsLoading(false);
      } catch (error) {
        console.warn('Supabase failed, using mock mode:', error);

        // Fallback to mock
        const userSubs = await getUserSubmissionsMock();
        setUserSubmissions(userSubs);

        const allSubs = await getAllSubmissionsMock();
        const enriched = allSubs.map(sub => {
          const challenge = getChallengeById(sub.challengeId);
          return {
            ...sub,
            challengeTitle: challenge?.title,
            challengeIcon: challenge?.icon,
          };
        });
        setSubmissions(enriched);
        setIsLoading(false);
      }
    };

    loadFeed();
  }, []);

  // Filter submissions by category
  const filteredSubmissions = selectedCategory === 'all'
    ? submissions
    : submissions.filter(sub => sub.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl"
        >
          🌊
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* User menu */}
      <UserMenu />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-jellyfish/10 blob"
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
        className="absolute bottom-40 left-20 w-80 h-80 bg-sunset/10 blob"
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

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-ocean-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Community Feed
          </h1>
          <p className="text-xl text-ocean-white/90 font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            See what humans are making today
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          <motion.a
            href="/daily"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            📸 Today's Challenge
          </motion.a>
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            💬 Join Chat
          </motion.a>
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <p className="text-sm text-ocean-white/80 font-medium text-center mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            Filter by category
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                selectedCategory === 'all'
                  ? 'glass border-2 border-ocean-white/60 text-ocean-white soft-shadow'
                  : 'glass text-ocean-white/80 border border-ocean-white/30'
              }`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            >
              ✨ All
            </motion.button>
            {(Object.entries(categoryConfig) as [SubmissionCategory, typeof categoryConfig[SubmissionCategory]][]).map(([key, config]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedCategory(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  selectedCategory === key
                    ? `glass border-2 ${config.color} text-ocean-white soft-shadow`
                    : 'glass text-ocean-white/80 border border-ocean-white/30'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
              >
                {config.icon} {config.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {!isVerified() ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-[40px] soft-shadow text-center max-w-2xl mx-auto"
          >
            <div className="text-7xl mb-6">👋</div>
            <h2 className="text-3xl font-bold text-ocean-white mb-4" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              Welcome to human-first!
            </h2>
            <p className="text-xl text-ocean-white/90 font-medium mb-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Complete your first challenge to unlock the community feed
            </p>

            <div className="bg-jellyfish-glow/20 rounded-3xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{challenge.icon}</span>
                <div>
                  <p className="text-lg font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    Today's Challenge: {challenge.title}
                  </p>
                  <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    {challenge.description}
                  </p>
                </div>
              </div>

              <p className="text-ocean-white/85 font-medium mb-3" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                🎯 What happens next:
              </p>
              <ul className="space-y-2 text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                <li className="flex items-start gap-2">
                  <span>1️⃣</span>
                  <span>Complete the challenge (2-5 minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2️⃣</span>
                  <span>Upload your photo/video</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3️⃣</span>
                  <span>See the community feed & join the chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>4️⃣</span>
                  <span>Start your daily streak 🔥</span>
                </li>
              </ul>
            </div>

            <motion.a
              href="/daily"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block glass px-10 py-5 rounded-full text-xl font-bold text-ocean-white soft-shadow hover:glow transition-all mb-3"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              {challenge.icon} Start Today's Challenge
            </motion.a>

            <p className="text-sm text-ocean-white/60 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Let's prove you're human!
            </p>
          </motion.div>
        ) : filteredSubmissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 rounded-[40px] soft-shadow text-center max-w-2xl mx-auto"
          >
            <div className="text-6xl mb-6">
              {selectedCategory === 'all' ? '🌱' : '🔍'}
            </div>
            <h2 className="text-2xl font-bold text-ocean-white mb-4" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              {selectedCategory === 'all'
                ? 'Feed is quiet today'
                : `No ${categoryConfig[selectedCategory as SubmissionCategory]?.label.toLowerCase()} submissions yet`}
            </h2>
            <p className="text-xl text-ocean-white/90 font-medium mb-8" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {selectedCategory === 'all'
                ? 'Be the first to share today!'
                : 'Try a different category or be the first to post!'}
            </p>

            <div className="bg-jellyfish-glow/20 rounded-3xl p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{challenge.icon}</span>
                <div>
                  <p className="text-lg font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    Today's Challenge: {challenge.title}
                  </p>
                  <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="/daily"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-8 py-4 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              >
                📸 Complete Today's Challenge
              </motion.a>
              {selectedCategory !== 'all' && (
                <motion.button
                  onClick={() => setSelectedCategory('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass px-8 py-4 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                >
                  View All Categories
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid"
              >
                <div className="glass p-6 rounded-3xl soft-shadow hover:glow transition-all">
                  {/* Challenge info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      {submission.challengeIcon && (
                        <span className="text-3xl">{submission.challengeIcon}</span>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                          {submission.challengeTitle || 'Challenge'}
                        </p>
                        <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                          {new Date(submission.createdAt).toLocaleDateString('en-SG', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {/* Category badge */}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${categoryConfig[submission.category].color}`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                      <span>{categoryConfig[submission.category].icon}</span>
                      <span className="text-ocean-white">{categoryConfig[submission.category].label}</span>
                    </span>
                  </div>

                  {/* Image/Video */}
                  <div className="rounded-2xl overflow-hidden mb-4">
                    {submission.imageUrl.startsWith('data:video') ? (
                      <video
                        src={submission.imageUrl}
                        controls
                        className="w-full h-auto"
                      />
                    ) : (
                      <img
                        src={submission.imageUrl}
                        alt={submission.caption || 'Submission'}
                        className="w-full h-auto object-cover"
                      />
                    )}
                  </div>

                  {/* Caption */}
                  {submission.caption && (
                    <p className="text-ocean-white/90 font-medium mb-3" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                      {submission.caption}
                    </p>
                  )}

                  {/* Footer - would show user info in production */}
                  <div className="flex items-center gap-2 text-sm text-ocean-white/75 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    <span>👤</span>
                    <span>Anonymous Human</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured Gallery */}
        {submissions.length > 0 && <FeaturedGallery />}
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
  );
}
