'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { mockSingpassLogin, getMockNRICs } from '@/lib/singpass';
import JellyfishAnimation from '@/components/JellyfishAnimation';

export default function LoginPage() {
  const [nric, setNric] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate Singpass authentication delay
    setTimeout(() => {
      const user = mockSingpassLogin(nric);

      if (user) {
        router.push('/');
      } else {
        setError('Authentication failed. Please check your NRIC.');
        setNric('');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Jellyfish animations */}
      <JellyfishAnimation />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-80 h-80 jellyfish-blob opacity-30"
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
        className="absolute bottom-20 left-20 w-96 h-96 jellyfish-blob opacity-25"
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

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-4 text-ocean-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            human-first
          </h1>
          <p className="text-xl text-ocean-white/90 font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            When AI is running, talk to humans
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-10 rounded-[40px] soft-shadow w-full"
        >
          <div className="mb-6 text-center">
            <div className="text-5xl mb-4">🇸🇬</div>
            <h2 className="text-2xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              Login with Singpass
            </h2>
            <p className="text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Secure authentication for GovTech
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-ocean-white/80 font-medium mb-2 text-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                Last 4 digits of NRIC
              </label>
              <input
                type="text"
                value={nric}
                onChange={(e) => setNric(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                placeholder="1234"
                maxLength={4}
                className="w-full px-6 py-4 rounded-full bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-bold placeholder:text-deep-sea-light/70 text-center text-2xl tracking-widest"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-sunset/20 border border-sunset/40"
              >
                <p className="text-ocean-white font-medium text-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  {error}
                </p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={nric.length !== 4 || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass px-8 py-5 rounded-full text-lg font-bold text-ocean-white soft-shadow hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🔐
                  </motion.span>
                  Authenticating with Singpass...
                </span>
              ) : (
                'Login with Singpass →'
              )}
            </motion.button>
          </form>

          <div className="mt-8 p-4 bg-jellyfish-glow/20 rounded-2xl border border-jellyfish-glow/30">
            <p className="text-xs text-ocean-white/70 text-center font-medium mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              🎭 Demo Mode - Valid NRICs (last 4 digits):
            </p>
            <p className="text-sm text-ocean-white font-bold text-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              {getMockNRICs().join(' • ')}
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-ocean-white/60 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Production uses OIDC with Singpass Mobile
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-ocean-white/70 font-medium text-center"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          For GovTech Singapore · Hackathon Demo
        </motion.p>
      </main>
    </div>
  );
}
