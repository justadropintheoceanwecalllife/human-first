'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { mockSingpassLogin, getMockUsers } from '@/lib/singpass';
import JellyfishAnimation from '@/components/JellyfishAnimation';

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [authStep, setAuthStep] = useState<'select' | 'verifying' | 'success'>('select');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();

  const handleLoginClick = () => {
    setShowModal(true);
    setAuthStep('select');
  };

  const handleUserSelect = (nric: string) => {
    setSelectedUser(nric);
    setAuthStep('verifying');

    // Simulate face verification
    setTimeout(() => {
      setAuthStep('success');

      // Complete authentication
      setTimeout(() => {
        mockSingpassLogin(nric);
        router.push('/');
      }, 1000);
    }, 2000);
  };

  const mockUsers = getMockUsers();

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
          <div className="mb-8 text-center">
            <div className="text-5xl mb-4">🇸🇬</div>
            <h2 className="text-2xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              Welcome to human-first
            </h2>
            <p className="text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Login securely with Singpass
            </p>
          </div>

          <motion.button
            onClick={handleLoginClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-8 py-6 rounded-full text-lg font-bold transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🇸🇬</span>
            <span>Login with Singpass</span>
          </motion.button>

          <div className="mt-6 text-center">
            <p className="text-xs text-ocean-white/60 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Secure authentication for GovTech employees
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

      {/* Singpass Authentication Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => authStep === 'select' && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              {authStep === 'select' && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
                      🇸🇬
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Singpass Login
                    </h3>
                    <p className="text-gray-600">
                      Select your profile to authenticate
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {Object.entries(mockUsers).map(([nric, user]) => (
                      <motion.button
                        key={nric}
                        onClick={() => handleUserSelect(nric)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 hover:border-red-500 transition-colors text-left"
                      >
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">NRIC: {user.nric}</p>
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                </>
              )}

              {authStep === 'verifying' && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
                  >
                    📱
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Verifying Identity
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Please scan your face with Singpass app
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-red-600 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-red-600 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-red-600 rounded-full"
                    />
                  </div>
                </div>
              )}

              {authStep === 'success' && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl"
                  >
                    ✅
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Authentication Successful
                  </h3>
                  <p className="text-gray-600">
                    Redirecting to human-first...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
