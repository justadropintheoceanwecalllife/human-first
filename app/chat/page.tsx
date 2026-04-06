'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodaysChallenge } from '@/lib/challenges';
import { getOrCreateUser } from '@/lib/supabaseUserManager';
import {
  getChatMessages,
  sendChatMessage,
  subscribeToChatMessages,
  type ChatMessage,
} from '@/lib/chatManager';
import type { User } from '@/types/user';

export default function Chat() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const challenge = getTodaysChallenge();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user and load messages
  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getOrCreateUser();
        setUser(currentUser);

        const existingMessages = await getChatMessages(challenge.id);
        setMessages(existingMessages);
        setIsLoading(false);

        // Subscribe to real-time updates
        const channel = subscribeToChatMessages(challenge.id, (newMsg) => {
          setMessages(prev => [...prev, newMsg]);
        });

        return () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        setIsLoading(false);
      }
    };

    init();
  }, [challenge.id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || isSending) return;

    setIsSending(true);

    try {
      await sendChatMessage(
        challenge.id,
        user.anonymousId,
        newMessage.trim(),
        user.displayName
      );
      setNewMessage('');

      // Trigger AI facilitator after every 5 messages
      if (messages.length % 5 === 4) {
        // Call AI facilitate API in background
        fetch('/api/ai-facilitate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId: challenge.id }),
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl"
        >
          💬
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-water-light/20 via-transparent to-jellyfish/10" />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-40 right-20 w-48 h-48 bg-sunset/10 blob"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-water/20 glass">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-deep-sea flex items-center gap-3">
                <span className="text-4xl">{challenge.icon}</span>
                Live Chat
              </h1>
              <p className="text-water-dark mt-1">
                Today's challenge: {challenge.title}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.a
                href="/daily"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-5 py-2 rounded-full font-semibold text-deep-sea text-sm soft-shadow hover:glow transition-all"
              >
                📸 Challenge
              </motion.a>
              <motion.a
                href="/feed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-5 py-2 rounded-full font-semibold text-deep-sea text-sm soft-shadow hover:glow transition-all"
              >
                🎨 Feed
              </motion.a>
            </div>
          </div>
          {user && (
            <p className="text-sm text-water-dark/60">
              Chatting as <span className="font-semibold">{user.displayName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 rounded-3xl soft-shadow text-center"
            >
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-2xl font-bold text-deep-sea mb-2">
                Start the conversation!
              </h2>
              <p className="text-water-dark">
                Share what you made, ask questions, or just say hi
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${msg.isAi ? 'justify-center' : 'justify-start'}`}
                >
                  {msg.isAi ? (
                    // AI message - centered with glow
                    <div className="glass px-6 py-4 rounded-3xl soft-shadow max-w-2xl glow">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🤖</div>
                        <div>
                          <p className="font-semibold text-jellyfish text-sm mb-1">
                            AI Facilitator
                          </p>
                          <p className="text-deep-sea">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // User message
                    <div className="glass px-6 py-4 rounded-3xl soft-shadow max-w-2xl">
                      <p className="font-semibold text-water-dark text-sm mb-1">
                        {msg.displayName || 'Anonymous Human'}
                      </p>
                      <p className="text-deep-sea">{msg.message}</p>
                      <p className="text-xs text-water-dark/50 mt-2">
                        {new Date(msg.createdAt).toLocaleTimeString('en-SG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 p-6 border-t border-water/20 glass">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what you made, ask a question..."
              className="flex-1 px-6 py-4 rounded-full bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea placeholder:text-water-dark/50"
              disabled={isSending}
            />
            <motion.button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-semibold text-deep-sea soft-shadow hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? '...' : 'Send'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Back to home */}
      <div className="relative z-10 text-center pb-4">
        <a
          href="/"
          className="text-sm text-water-dark/60 hover:text-water-dark"
        >
          ← Back to home
        </a>
      </div>
    </div>
  );
}
