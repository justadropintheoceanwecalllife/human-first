'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, type SingpassUser } from '@/lib/singpass';

export default function UserMenu() {
  const [user, setUser] = useState<SingpassUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="glass px-5 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all flex items-center gap-2"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
      >
        <span>👤</span>
        <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
        <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 glass p-6 rounded-3xl soft-shadow min-w-[280px]"
          >
            <div className="mb-4 pb-4 border-b border-ocean-white/20">
              <p className="text-sm text-ocean-white/70 font-medium mb-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                Logged in as
              </p>
              <p className="text-lg font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                {user.name}
              </p>
              <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                NRIC: {user.nric}
              </p>
              {user.email && (
                <p className="text-xs text-ocean-white/70 font-medium mt-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  {user.email}
                </p>
              )}
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all bg-sunset/20 border border-sunset/40"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              🚪 Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
