'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAllSubmissions } from '@/lib/supabaseUserManager';
import { getAllSubmissionsMock } from '@/lib/mockUserManager';
import { getChallengeById } from '@/lib/challenges';
import type { Submission } from '@/types/user';

interface FeaturedSubmission extends Submission {
  challengeTitle?: string;
  challengeIcon?: string;
}

export default function FeaturedGallery() {
  const [featured, setFeatured] = useState<FeaturedSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch submissions and filter for "interesting" ones
    getAllSubmissions()
      .then(subs => {
        // Filter for specific interesting challenges (desk setup, workspace, etc.)
        const interesting = subs.filter(sub =>
          ['desk-view', 'favorite-mug', 'phone-wallpaper', 'made-smile'].includes(sub.challengeId)
        );

        // Enrich with challenge data
        const enriched = interesting.slice(0, 6).map(sub => {
          const challenge = getChallengeById(sub.challengeId);
          return {
            ...sub,
            challengeTitle: challenge?.title,
            challengeIcon: challenge?.icon,
          };
        });

        setFeatured(enriched);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to mock
        return getAllSubmissionsMock().then(subs => {
          const interesting = subs.filter(sub =>
            ['desk-view', 'favorite-mug', 'phone-wallpaper', 'made-smile', 'plant-photo'].includes(sub.challengeId)
          );

          const enriched = interesting.slice(0, 6).map(sub => {
            const challenge = getChallengeById(sub.challengeId);
            return {
              ...sub,
              challengeTitle: challenge?.title,
              challengeIcon: challenge?.icon,
            };
          });

          setFeatured(enriched);
          setIsLoading(false);
        });
      });
  }, []);

  if (isLoading || featured.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-12 border-t border-water/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-deep-sea mb-2 text-center">
          ✨ Featured Gallery
        </h2>
        <p className="text-deep-sea-light font-medium text-center">
          Interesting submissions from the community
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {featured.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-4 rounded-3xl soft-shadow hover:glow transition-all cursor-pointer"
          >
            <div className="relative rounded-2xl overflow-hidden mb-3">
              {submission.imageUrl.startsWith('data:video') ? (
                <video
                  src={submission.imageUrl}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img
                  src={submission.imageUrl}
                  alt={submission.caption || 'Submission'}
                  className="w-full h-48 object-cover"
                />
              )}
            </div>

            {submission.challengeIcon && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{submission.challengeIcon}</span>
                <p className="font-bold text-deep-sea text-sm">
                  {submission.challengeTitle}
                </p>
              </div>
            )}

            {submission.caption && (
              <p className="text-deep-sea-light text-sm font-medium line-clamp-2">
                {submission.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
