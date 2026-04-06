'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTodaysChallenge } from '@/lib/challenges';
import { getOrCreateUser, addSubmission, updateStreak } from '@/lib/userManager';
import type { User } from '@/types/user';

export default function DailyChallenge() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const challenge = getTodaysChallenge();

  useEffect(() => {
    const currentUser = getOrCreateUser();
    setUser(currentUser);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) return;

    setIsSubmitting(true);

    try {
      // For MVP, we'll store the file as base64 in localStorage
      // In production, this would upload to Supabase Storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;

        // Add submission
        addSubmission({
          userId: user.anonymousId,
          challengeId: challenge.id,
          imageUrl: base64,
          caption: caption || '',
        });

        // Update streak
        updateStreak();

        setHasSubmitted(true);
        setIsSubmitting(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-water-dark">Loading...</p>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[40px] soft-shadow text-center max-w-2xl relative z-10"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-deep-sea mb-4">
            You're human!
          </h1>
          <p className="text-xl text-water-dark mb-8">
            Thanks for sharing, {user.displayName}
          </p>

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-water-foam flex items-center justify-center">
                🔥
              </div>
              <div>
                <p className="font-semibold text-deep-sea">
                  {user.streakCount} day streak!
                </p>
                <p className="text-sm text-water-dark">Keep it going</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="/feed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-semibold text-deep-sea soft-shadow hover:glow transition-all"
            >
              See Community Feed
            </motion.a>
            <motion.a
              href="/chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-semibold text-deep-sea soft-shadow hover:glow transition-all"
            >
              Join the Chat
            </motion.a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-sunset/20 blob"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-water-foam/30 blob"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-8 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-water-dark/60 mb-2">Hello, {user.displayName}</p>
          <h1 className="text-5xl font-bold text-deep-sea mb-4">
            Prove you're human
          </h1>
          <p className="text-xl text-water-dark">
            Complete today's challenge to join the conversation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-10 rounded-[40px] soft-shadow w-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{challenge.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-deep-sea">{challenge.title}</h2>
              <p className="text-water-dark">{challenge.description}</p>
            </div>
          </div>

          <div className="mb-6 p-6 bg-water-foam/20 rounded-3xl">
            <p className="text-lg text-deep-sea italic">
              "{challenge.prompt}"
            </p>
          </div>

          {/* File upload */}
          <div className="space-y-4">
            {!previewUrl ? (
              <label className="block">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-water/30 rounded-3xl p-12 text-center cursor-pointer hover:border-water transition-colors hover:bg-water-foam/10">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-water-dark font-semibold mb-2">
                    Click to upload photo or video
                  </p>
                  <p className="text-sm text-water-dark/60">
                    Max 10MB • Images or videos
                  </p>
                </div>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden">
                  {selectedFile?.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-sm text-water-dark hover:text-deep-sea underline"
                >
                  Choose a different file
                </button>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption (optional)"
                  className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none resize-none"
                  rows={3}
                />

                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass px-8 py-5 rounded-full text-lg font-semibold text-deep-sea soft-shadow hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit & Join the Humans'}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-water-dark/60 hover:text-water-dark"
        >
          ← Back to home
        </motion.a>
      </main>
    </div>
  );
}
