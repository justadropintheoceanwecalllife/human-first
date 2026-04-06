'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser, type SingpassUser } from '@/lib/singpass';

interface LeaderboardUser {
  displayName: string;
  streakCount: number;
  isCurrentUser: boolean;
}

// Mock leaderboard data
const mockLeaderboard: LeaderboardUser[] = [
  { displayName: 'Sarah Chua', streakCount: 42, isCurrentUser: false },
  { displayName: 'Marcus Wong Jun Wei', streakCount: 38, isCurrentUser: false },
  { displayName: 'Kevin Ng', streakCount: 35, isCurrentUser: false },
  { displayName: 'Rachel Koh', streakCount: 28, isCurrentUser: false },
  { displayName: 'Alex Tan Wei Ming', streakCount: 24, isCurrentUser: false },
  { displayName: 'Jamie Lim Hui Ling', streakCount: 19, isCurrentUser: false },
  { displayName: 'Daniel Lee', streakCount: 15, isCurrentUser: false },
  { displayName: 'Lisa Tan', streakCount: 12, isCurrentUser: false },
  { displayName: 'Ryan Poh', streakCount: 8, isCurrentUser: false },
  { displayName: 'You', streakCount: 0, isCurrentUser: true },
];

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<SingpassUser | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // Create leaderboard with current user
    let leaderboard = [...mockLeaderboard];

    if (user) {
      // Remove placeholder "You" entry
      leaderboard = leaderboard.filter(u => !u.isCurrentUser);

      // Add current user with their streak (default to 0 for demo)
      leaderboard.push({
        displayName: user.name.split(' ')[0], // First name only
        streakCount: 0, // Would fetch from user data in production
        isCurrentUser: true,
      });
    }

    // Sort by streak count and take top 10
    leaderboard.sort((a, b) => b.streakCount - a.streakCount);
    setTopUsers(leaderboard.slice(0, 10));
  }, []);

  if (topUsers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass p-8 rounded-[40px] soft-shadow">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            🏆 Leaderboard
          </h2>
          <p className="text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            Top daily streak champions
          </p>
        </div>

        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <motion.div
              key={`${user.displayName}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-2xl ${
                user.isCurrentUser
                  ? 'bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60'
                  : 'bg-ocean-white/20 border border-ocean-white/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500/80 text-yellow-900' :
                  index === 1 ? 'bg-gray-400/80 text-gray-900' :
                  index === 2 ? 'bg-orange-600/80 text-orange-900' :
                  'bg-ocean-white/40 text-ocean-white'
                }`}>
                  {index === 0 ? '🥇' :
                   index === 1 ? '🥈' :
                   index === 2 ? '🥉' :
                   `${index + 1}`}
                </div>
                <div>
                  <p className={`font-bold ${user.isCurrentUser ? 'text-ocean-white' : 'text-ocean-white'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    {user.displayName} {user.isCurrentUser && '(You)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-2xl font-bold text-ocean-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                  {user.streakCount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {currentUser && (
          <div className="mt-6 p-4 bg-jellyfish-glow/20 rounded-2xl border border-jellyfish-glow/30 text-center">
            <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              💡 Complete daily challenges to climb the leaderboard!
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/leaderboard"
            className="text-sm text-ocean-white/80 font-bold hover:text-ocean-white underline transition-colors"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            View Full Leaderboard →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
