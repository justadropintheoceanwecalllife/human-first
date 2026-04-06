'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTodaysChallenge } from '@/lib/challenges';
import { getOrCreateUser, addSubmission, updateStreak, uploadFile } from '@/lib/supabaseUserManager';
import { getOrCreateUserMock, addSubmissionMock, updateStreakMock, uploadFileMock } from '@/lib/mockUserManager';
import type { User } from '@/types/user';

interface ValidationResult {
  isValid: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  suggestion: string | null;
}

export default function DailyChallenge() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const challenge = getTodaysChallenge();

  useEffect(() => {
    // Try Supabase first, fallback to mock mode if it fails
    getOrCreateUser()
      .then(setUser)
      .catch(error => {
        console.warn('Supabase failed, using mock mode:', error);
        setIsMockMode(true);
        return getOrCreateUserMock().then(setUser);
      });
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

    // Reset validation when new file is selected
    setValidation(null);
  };

  const handleValidate = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsValidating(true);

    try {
      // Convert file to base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch('/api/validate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            challengeTitle: challenge.title,
            challengeDescription: challenge.description,
            challengePrompt: challenge.prompt,
          }),
        });

        if (!response.ok) {
          throw new Error('Validation failed');
        }

        const result = await response.json();
        setValidation(result);
        setIsValidating(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Validation error:', error);
      alert('Failed to validate image. Please try again.');
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) return;

    setIsSubmitting(true);

    try {
      if (isMockMode) {
        // Mock mode - use localStorage
        const imageUrl = await uploadFileMock(selectedFile);
        await addSubmissionMock(challenge.id, imageUrl, caption);
        await updateStreakMock();
      } else {
        // Real mode - use Supabase
        const imageUrl = await uploadFile(selectedFile);
        await addSubmission(challenge.id, imageUrl, caption);
        await updateStreak();
      }

      setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ocean-white font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Loading...</p>
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
          <h1 className="text-4xl font-bold text-ocean-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            You're human!
          </h1>
          <p className="text-xl text-ocean-white/90 font-medium mb-8" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            Thanks for sharing, {user.displayName}
          </p>

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-water-foam flex items-center justify-center">
                🔥
              </div>
              <div>
                <p className="font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                  {user.streakCount} day streak!
                </p>
                <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>Keep it going</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="/feed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              See Community Feed
            </motion.a>
            <motion.a
              href="/chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
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
        {isMockMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass px-6 py-3 rounded-full soft-shadow text-center bg-sunset/20"
          >
            <p className="text-sm text-ocean-white font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              🎭 Demo Mode - Using mock data (Supabase not connected)
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-ocean-white/80 mb-2 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>Hello, {user.displayName}</p>
          <h1 className="text-5xl font-bold text-ocean-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Prove you're human
          </h1>
          <p className="text-xl text-ocean-white/90 font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
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
              <h2 className="text-2xl font-bold text-ocean-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>{challenge.title}</h2>
              <p className="text-ocean-white/85 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{challenge.description}</p>
            </div>
          </div>

          <div className="mb-6 p-6 bg-water-foam/30 rounded-3xl border border-water/20">
            <p className="text-lg text-ocean-white italic font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
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
                <div className="border-2 border-dashed border-water/50 rounded-3xl p-12 text-center cursor-pointer hover:border-water transition-colors hover:bg-water-foam/10">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-ocean-white font-bold mb-2 text-lg" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    Click to upload photo or video
                  </p>
                  <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
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
                    setValidation(null);
                  }}
                  className="text-sm text-ocean-white/80 hover:text-ocean-white underline font-medium"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
                >
                  Choose a different file
                </button>

                {/* Validation button and results */}
                {!validation && !isValidating && (
                  <motion.button
                    onClick={handleValidate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full glass px-8 py-4 rounded-full text-md font-bold text-ocean-white soft-shadow hover:glow transition-all border-2 border-water/30"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                  >
                    🤖 Verify with AI
                  </motion.button>
                )}

                {isValidating && (
                  <div className="glass p-6 rounded-3xl soft-shadow text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-4xl mb-3"
                    >
                      🤖
                    </motion.div>
                    <p className="text-ocean-white font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>AI is checking your submission...</p>
                  </div>
                )}

                {validation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-3xl soft-shadow border-2 ${
                      validation.isValid
                        ? 'bg-moss/20 border-moss/40'
                        : 'bg-sunset/20 border-sunset/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">
                        {validation.isValid ? '✅' : '🤔'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-ocean-white text-lg mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                          {validation.isValid ? 'Looks good!' : 'Hmm...'}
                        </p>
                        <p className="text-ocean-white/85 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                          {validation.reasoning}
                        </p>
                        {validation.suggestion && (
                          <p className="text-ocean-white/85 font-medium mt-2 italic" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                            💡 {validation.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                    {!validation.isValid && (
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setValidation(null);
                        }}
                        className="text-sm text-ocean-white hover:text-ocean-white/80 underline font-bold"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
                      >
                        Try again with a different photo
                      </button>
                    )}
                  </motion.div>
                )}

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption (optional)"
                  className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none resize-none text-deep-sea font-medium placeholder:text-deep-sea-light/70"
                  rows={3}
                />

                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!validation && !isMockMode)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass px-8 py-5 rounded-full text-lg font-bold text-ocean-white soft-shadow hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                  title={!validation && !isMockMode ? 'Please verify your image first' : ''}
                >
                  {isSubmitting ? 'Submitting...' : validation?.isValid ? 'Submit & Join the Humans ✨' : 'Submit Anyway'}
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
          className="text-sm text-ocean-white/80 font-medium hover:text-ocean-white underline"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          ← Back to home
        </motion.a>
      </main>
    </div>
  );
}
