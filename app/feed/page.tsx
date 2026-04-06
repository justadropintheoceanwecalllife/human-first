'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllSubmissions } from '@/lib/supabaseUserManager';
import { getAllSubmissionsMock } from '@/lib/mockUserManager';
import { getChallengeById } from '@/lib/challenges';
import type { Submission } from '@/types/user';

interface SubmissionWithChallenge extends Submission {
  challengeTitle?: string;
  challengeIcon?: string;
}

export default function Feed() {
  const [submissions, setSubmissions] = useState<SubmissionWithChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try Supabase first, fallback to mock mode
    getAllSubmissions()
      .then(subs => {
        // Enrich with challenge data
        const enriched = subs.map(sub => {
          const challenge = getChallengeById(sub.challengeId);
          return {
            ...sub,
            challengeTitle: challenge?.title,
            challengeIcon: challenge?.icon,
          };
        });

        setSubmissions(enriched);
        setIsLoading(false);
      })
      .catch(error => {
        console.warn('Supabase failed, using mock data:', error);
        // Fallback to mock data
        return getAllSubmissionsMock().then(subs => {
          const enriched = subs.map(sub => {
            const challenge = getChallengeById(sub.challengeId);
            return {
              ...sub,
              challengeTitle: challenge?.title,
              challengeIcon: challenge?.icon,
            };
          });
          setSubmissions(enriched);
          setIsLoading(false);
        });
      });
  }, []);

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
          <h1 className="text-5xl font-bold text-deep-sea mb-4">
            Community Feed
          </h1>
          <p className="text-xl text-water-dark">
            See what humans are making today
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          <motion.a
            href="/daily"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-semibold text-deep-sea soft-shadow hover:glow transition-all"
          >
            📸 Today's Challenge
          </motion.a>
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-semibold text-deep-sea soft-shadow hover:glow transition-all"
          >
            💬 Join Chat
          </motion.a>
        </div>
      </div>

      {/* Feed */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 rounded-[40px] soft-shadow text-center"
          >
            <div className="text-6xl mb-6">🌱</div>
            <h2 className="text-2xl font-bold text-deep-sea mb-4">
              No submissions yet
            </h2>
            <p className="text-water-dark mb-6">
              Be the first to complete today's challenge!
            </p>
            <motion.a
              href="/daily"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block glass px-8 py-4 rounded-full font-semibold text-deep-sea soft-shadow hover:glow transition-all"
            >
              Get Started
            </motion.a>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid"
              >
                <div className="glass p-6 rounded-3xl soft-shadow hover:glow transition-all">
                  {/* Challenge info */}
                  <div className="flex items-center gap-3 mb-4">
                    {submission.challengeIcon && (
                      <span className="text-3xl">{submission.challengeIcon}</span>
                    )}
                    <div>
                      <p className="font-semibold text-deep-sea">
                        {submission.challengeTitle || 'Challenge'}
                      </p>
                      <p className="text-sm text-water-dark">
                        {new Date(submission.createdAt).toLocaleDateString('en-SG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
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
                    <p className="text-deep-sea mb-3">
                      {submission.caption}
                    </p>
                  )}

                  {/* Footer - would show user info in production */}
                  <div className="flex items-center gap-2 text-sm text-deep-sea-light font-medium">
                    <span>👤</span>
                    <span>Anonymous Human</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center mt-12"
      >
        <a
          href="/"
          className="text-sm text-deep-sea-light font-medium hover:text-deep-sea underline"
        >
          ← Back to home
        </a>
      </motion.div>
    </div>
  );
}
