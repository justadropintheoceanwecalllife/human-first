'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JellyfishAnimation from '@/components/JellyfishAnimation';
import HomeHeader from '@/components/HomeHeader';
import Leaderboard from '@/components/Leaderboard';
import { isVerified } from '@/lib/singpass';

export default function Home() {
  const [isUserVerified, setIsUserVerified] = useState(false);

  useEffect(() => {
    setIsUserVerified(isVerified());
  }, []);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sticky Header */}
      <HomeHeader />

      {/* Jellyfish animations */}
      <JellyfishAnimation />

      <div className={`flex flex-col items-center ${isUserVerified ? 'justify-start pt-12 pb-12 px-8' : 'justify-center p-8'}`}>

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 jellyfish-blob opacity-40"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 jellyfish-blob opacity-30"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] jellyfish-blob opacity-25"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main content */}
      <main className={`relative z-10 flex flex-col items-center max-w-4xl ${isUserVerified ? 'gap-6' : 'gap-12'}`}>
        {!isUserVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-7xl font-bold mb-6 text-ocean-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              human-first
            </h1>
            <p className="text-2xl text-ocean-white mb-4 font-semibold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Stay human in an AI-powered world
            </p>
            <p className="text-lg text-ocean-white/90 font-medium max-w-2xl mx-auto" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              Connect with colleagues, learn hands-on skills, and balance work with life.
              While AI handles your tasks, invest in what makes you human.
            </p>
          </motion.div>
        )}

        {!isUserVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass p-12 rounded-[40px] soft-shadow text-center max-w-2xl"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-ocean-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                How it works
              </h2>
            </div>

            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-jellyfish-pink/40 flex items-center justify-center flex-shrink-0 text-xl">
                  📸
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-white text-lg mb-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>Prove you're human</h3>
                  <p className="text-ocean-white/85 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Complete a daily hands-on task - take a photo of a plant, show your sunset, make origami</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-jellyfish-purple/40 flex items-center justify-center flex-shrink-0 text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-white text-lg mb-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>Join the conversation</h3>
                  <p className="text-ocean-white/85 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Drop into the live chatroom, share what you made, learn from others</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-jellyfish-glow/50 flex items-center justify-center flex-shrink-0 text-xl">
                  🌱
                </div>
                <div>
                  <h3 className="font-semibold text-ocean-white text-lg mb-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>Balance work & life</h3>
                  <p className="text-ocean-white/85 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Take intentional breaks, build skills, connect with your GovTech community</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isUserVerified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass p-8 rounded-[40px] soft-shadow text-center max-w-2xl"
          >
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-ocean-white mb-3" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              Welcome back!
            </h2>
            <p className="text-lg text-ocean-white/85 font-medium mb-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Explore activities, connect with the community, or check today's challenge
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/daily"
                className="glass px-6 py-3 rounded-full font-bold text-ocean-white text-sm soft-shadow hover:glow transition-all"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
              >
                📸 Daily Challenge
              </a>
              <a
                href="/hands-on"
                className="glass px-6 py-3 rounded-full font-bold text-ocean-white text-sm soft-shadow hover:glow transition-all"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
              >
                🎯 Activities
              </a>
              <a
                href="/feed"
                className="glass px-6 py-3 rounded-full font-bold text-ocean-white text-sm soft-shadow hover:glow transition-all"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
              >
                🎨 Gallery
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.a
            href="/daily"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(232, 180, 217, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="glass px-12 py-6 rounded-full text-xl font-bold text-ocean-white soft-shadow hover:glow transition-all inline-block"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Get Started
          </motion.a>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-ocean-white/70 font-medium"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          For GovTech Singapore · Work-Life Balance Initiative
        </motion.p>
      </main>

      {/* Leaderboard - Only show for new users */}
      {!isUserVerified && (
        <div className="relative z-10 mt-16 px-8 pb-12 w-full">
          <Leaderboard />
        </div>
      )}
      </div>
    </div>
  );
}
