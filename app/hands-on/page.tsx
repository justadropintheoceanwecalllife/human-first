'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockActivities, categoryConfig, type Activity, type ActivityCategory } from '@/types/activity';
import UserMenu from '@/components/UserMenu';
import Leaderboard from '@/components/Leaderboard';

export default function HandsOnPage() {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');

  // Filter and sort activities
  let filteredActivities = selectedCategory === 'all'
    ? mockActivities
    : mockActivities.filter(act => act.category === selectedCategory);

  filteredActivities = [...filteredActivities].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.upvotes - a.upvotes;
    } else {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* User menu */}
      <UserMenu />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-coral/10 blob"
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
        className="absolute bottom-40 left-20 w-80 h-80 bg-lavender/10 blob"
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
      <div className="relative z-10 max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-ocean-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            🎯 Hands-On Activities
          </h1>
          <p className="text-xl text-ocean-white/90 font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            Learn something new, try a hobby, or pick up a skill
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <motion.a
            href="/feed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            🎨 Community Feed
          </motion.a>
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            💬 Join Chat
          </motion.a>
          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-3 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            ➕ Add Activity
          </motion.button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <p className="text-sm text-ocean-white/80 font-medium text-center mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            Filter by category
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                selectedCategory === 'all'
                  ? 'glass border-2 border-ocean-white/60 text-ocean-white soft-shadow'
                  : 'glass text-ocean-white/80 border border-ocean-white/30'
              }`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            >
              ✨ All
            </motion.button>
            {(Object.entries(categoryConfig) as [ActivityCategory, typeof categoryConfig[ActivityCategory]][]).map(([key, config]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedCategory(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  selectedCategory === key
                    ? `glass border-2 ${config.color} text-ocean-white soft-shadow`
                    : 'glass text-ocean-white/80 border border-ocean-white/30'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
              >
                {config.icon} {config.label}
              </motion.button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex justify-center gap-3">
            <motion.button
              onClick={() => setSortBy('popular')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                sortBy === 'popular'
                  ? 'glass border-2 border-ocean-white/60 text-ocean-white'
                  : 'glass text-ocean-white/70 border border-ocean-white/30'
              }`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            >
              🔥 Popular
            </motion.button>
            <motion.button
              onClick={() => setSortBy('recent')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                sortBy === 'recent'
                  ? 'glass border-2 border-ocean-white/60 text-ocean-white'
                  : 'glass text-ocean-white/70 border border-ocean-white/30'
              }`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            >
              🆕 Recent
            </motion.button>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="relative z-10 mt-16 px-8">
        <Leaderboard />
      </div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center mt-12 pb-8"
      >
        <a
          href="/"
          className="text-sm text-ocean-white/80 font-medium hover:text-ocean-white underline"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          ← Back to home
        </a>
      </motion.div>

      {/* Add Activity Modal */}
      <AddActivityModal show={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const config = categoryConfig[activity.category];
  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass p-6 rounded-3xl soft-shadow hover:glow transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{activity.icon}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.color}`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
          <span className="text-ocean-white">{config.label}</span>
        </span>
      </div>

      <h3 className="text-xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        {activity.title}
      </h3>

      <p className="text-ocean-white/85 font-medium mb-4 text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
        {activity.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-ocean-white/20 rounded-full text-xs font-bold text-ocean-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
          ⏱️ {activity.duration}
        </span>
        <span className={`px-3 py-1 bg-ocean-white/20 rounded-full text-xs font-bold ${difficultyColors[activity.difficulty]}`}>
          💪 {activity.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-ocean-white/20">
        <div className="text-xs text-ocean-white/70 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
          by {activity.submittedBy}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">👍</span>
          <span className="text-sm font-bold text-ocean-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            {activity.upvotes}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AddActivityModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('skills');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would submit to backend here
    alert('Activity submitted! (Demo mode - not saved)');
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('skills');
    setDifficulty('easy');
    setDuration('');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass p-8 rounded-[40px] soft-shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              ➕ Add New Activity
            </h2>
            <p className="text-ocean-white/80 font-medium mb-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Share something new for the community to try!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-ocean-white/80 font-bold mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  Title <span className="text-sunset">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Learn Basic Origami"
                  className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium placeholder:text-deep-sea-light/70"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-ocean-white/80 font-bold mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  Description <span className="text-sunset">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is it? Why should people try it?"
                  className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none resize-none text-deep-sea font-medium placeholder:text-deep-sea-light/70"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ocean-white/80 font-bold mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                    className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-ocean-white/80 font-bold mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-ocean-white/80 font-bold mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                  Duration <span className="text-sunset">*</span>
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 5 mins, 30 mins, 1 hour"
                  className="w-full p-4 rounded-2xl bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium placeholder:text-deep-sea-light/70"
                  required
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 glass px-8 py-4 rounded-full text-lg font-bold text-ocean-white soft-shadow hover:glow transition-all bg-jellyfish-pink/30 border-2 border-jellyfish-pink/60"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                >
                  Submit Activity
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full text-lg font-bold text-ocean-white/80 hover:text-ocean-white transition-all"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
