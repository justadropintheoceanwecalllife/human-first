'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser, type SingpassUser } from '@/lib/singpass';
import UserMenu from '@/components/UserMenu';

interface LeaderboardUser {
  displayName: string;
  streakCount: number;
  isCurrentUser: boolean;
  completedToday: boolean;
}

// Extended mock leaderboard data
const mockLeaderboard: LeaderboardUser[] = [
  { displayName: 'Sarah Chua', streakCount: 42, isCurrentUser: false, completedToday: true },
  { displayName: 'Marcus Wong Jun Wei', streakCount: 38, isCurrentUser: false, completedToday: true },
  { displayName: 'Kevin Ng', streakCount: 35, isCurrentUser: false, completedToday: true },
  { displayName: 'Rachel Koh', streakCount: 28, isCurrentUser: false, completedToday: false },
  { displayName: 'Alex Tan Wei Ming', streakCount: 24, isCurrentUser: false, completedToday: true },
  { displayName: 'Jamie Lim Hui Ling', streakCount: 19, isCurrentUser: false, completedToday: true },
  { displayName: 'Daniel Lee', streakCount: 15, isCurrentUser: false, completedToday: false },
  { displayName: 'Lisa Tan', streakCount: 12, isCurrentUser: false, completedToday: true },
  { displayName: 'Ryan Poh', streakCount: 8, isCurrentUser: false, completedToday: false },
  { displayName: 'Priya Kumar', streakCount: 7, isCurrentUser: false, completedToday: true },
  { displayName: 'Wei Chen', streakCount: 5, isCurrentUser: false, completedToday: false },
  { displayName: 'Michelle Ng', streakCount: 4, isCurrentUser: false, completedToday: true },
  { displayName: 'Ahmad Hassan', streakCount: 3, isCurrentUser: false, completedToday: false },
  { displayName: 'Benjamin Loh', streakCount: 2, isCurrentUser: false, completedToday: true },
  { displayName: 'You', streakCount: 0, isCurrentUser: true, completedToday: false },
];

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<SingpassUser | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all-time' | 'this-month' | 'this-week'>('all-time');

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // Create leaderboard with current user
    let leaderboard = [...mockLeaderboard];

    if (user) {
      // Remove placeholder "You" entry
      leaderboard = leaderboard.filter(u => !u.isCurrentUser);

      // Add current user with their streak
      leaderboard.push({
        displayName: user.name.split(' ')[0], // First name only
        streakCount: 0, // Would fetch from user data in production
        isCurrentUser: true,
        completedToday: false,
      });
    }

    // Sort by streak count
    leaderboard.sort((a, b) => b.streakCount - a.streakCount);
    setUsers(leaderboard);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-ocean-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-ocean-white/20 transition-colors"
            >
              <span className="text-ocean-white text-xl">←</span>
            </a>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-jellyfish-pink/30 flex items-center justify-center text-xl">
                🏆
              </div>
              <span className="text-xl font-bold text-ocean-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                human-first
              </span>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>

      <div className="p-8">{/* User menu removed - now in header */}

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-sunset/20 blob"
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
        className="absolute bottom-40 left-20 w-80 h-80 bg-jellyfish-pink/20 blob"
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
      <div className="relative z-10 max-w-4xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-ocean-white mb-4 flex items-center justify-center gap-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <span className="text-6xl">🏆</span>
            Leaderboard
          </h1>
          <p className="text-xl text-ocean-white/90 font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            Top daily streak champions
          </p>
        </motion.div>

        {/* Time filter */}
        <div className="flex justify-center gap-3 mb-8">
          <motion.button
            onClick={() => setTimeFilter('all-time')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              timeFilter === 'all-time'
                ? 'glass border-2 border-ocean-white/60 text-ocean-white soft-shadow'
                : 'glass text-ocean-white/80 border border-ocean-white/30'
            }`}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
          >
            All Time
          </motion.button>
          <motion.button
            onClick={() => setTimeFilter('this-month')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              timeFilter === 'this-month'
                ? 'glass border-2 border-ocean-white/60 text-ocean-white soft-shadow'
                : 'glass text-ocean-white/80 border border-ocean-white/30'
            }`}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
          >
            This Month
          </motion.button>
          <motion.button
            onClick={() => setTimeFilter('this-week')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              timeFilter === 'this-week'
                ? 'glass border-2 border-ocean-white/60 text-ocean-white soft-shadow'
                : 'glass text-ocean-white/80 border border-ocean-white/30'
            }`}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
          >
            This Week
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl soft-shadow text-center"
          >
            <div className="text-4xl mb-2">👥</div>
            <p className="text-2xl font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {users.length}
            </p>
            <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Active Users
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl soft-shadow text-center"
          >
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {users[0]?.streakCount || 0}
            </p>
            <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Longest Streak
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-3xl soft-shadow text-center"
          >
            <div className="text-4xl mb-2">✅</div>
            <p className="text-2xl font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {users.filter(u => u.completedToday).length}
            </p>
            <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Completed Today
            </p>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="glass p-8 rounded-[40px] soft-shadow">
          <div className="space-y-3">
            {users.map((user, index) => (
              <motion.div
                key={`${user.displayName}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center justify-between p-5 rounded-2xl ${
                  user.isCurrentUser
                    ? 'bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60'
                    : index < 3
                    ? 'bg-ocean-white/30 border-2 border-ocean-white/40'
                    : 'bg-ocean-white/20 border border-ocean-white/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500/80 text-yellow-900' :
                    index === 1 ? 'bg-gray-400/80 text-gray-900' :
                    index === 2 ? 'bg-orange-600/80 text-orange-900' :
                    'bg-ocean-white/40 text-ocean-white'
                  }`}>
                    {index === 0 ? '🥇' :
                     index === 1 ? '🥈' :
                     index === 2 ? '🥉' :
                     index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-lg ${user.isCurrentUser ? 'text-ocean-white' : 'text-ocean-white'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                        {user.displayName} {user.isCurrentUser && '(You)'}
                      </p>
                      {user.completedToday && (
                        <span className="px-2 py-0.5 bg-green-500/80 rounded-full text-xs font-bold text-white">
                          ✓ Today
                        </span>
                      )}
                    </div>
                    {index < 3 && (
                      <p className="text-xs text-ocean-white/70 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                        {index === 0 ? '👑 Champion' : index === 1 ? '🌟 Runner-up' : '🎖️ Top 3'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-3xl font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    {user.streakCount}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {currentUser && (
            <div className="mt-8 p-4 bg-jellyfish-glow/20 rounded-2xl border border-jellyfish-glow/30 text-center">
              <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                💡 Complete daily challenges to climb the leaderboard!
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
