'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-jellyfish/20 blob"
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
        className="absolute bottom-20 right-10 w-96 h-96 bg-water-foam/30 blob"
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
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-sunset/20 blob -translate-x-1/2 -translate-y-1/2"
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
      <main className="relative z-10 flex flex-col items-center gap-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-7xl font-bold mb-6 text-deep-sea">
            human-first
          </h1>
          <p className="text-2xl text-deep-sea-light mb-4 font-semibold">
            When AI is running, talk to humans
          </p>
          <p className="text-lg text-deep-sea-light font-medium max-w-2xl mx-auto">
            A space to reconnect with what matters while your agents execute.
            Learn something new, touch grass, and remember you're human.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass p-12 rounded-[40px] soft-shadow text-center max-w-2xl"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-deep-sea mb-4">
              How it works
            </h2>
          </div>

          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-water-foam flex items-center justify-center flex-shrink-0 text-xl">
                📸
              </div>
              <div>
                <h3 className="font-semibold text-deep-sea text-lg mb-1">Prove you're human</h3>
                <p className="text-deep-sea-light font-medium">Complete a daily hands-on task - take a photo of a plant, show your sunset, make origami</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-jellyfish/30 flex items-center justify-center flex-shrink-0 text-xl">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-deep-sea text-lg mb-1">Join the conversation</h3>
                <p className="text-deep-sea-light font-medium">Drop into the live chatroom, share what you made, learn from others</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sunset/40 flex items-center justify-center flex-shrink-0 text-xl">
                🌱
              </div>
              <div>
                <h3 className="font-semibold text-deep-sea text-lg mb-1">Balance work & life</h3>
                <p className="text-deep-sea-light font-medium">Take intentional breaks, build skills, connect with your GovTech community</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.a
          href="/daily"
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 179, 217, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="glass px-12 py-6 rounded-full text-xl font-semibold text-deep-sea soft-shadow hover:glow transition-all inline-block"
        >
          Get Started
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-deep-sea-light font-medium"
        >
          For GovTech Singapore · Work-Life Balance Initiative
        </motion.p>
      </main>
    </div>
  );
}
