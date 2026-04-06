'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodaysChallenge } from '@/lib/challenges';
import { getOrCreateUser } from '@/lib/supabaseUserManager';
import { getOrCreateUserMock } from '@/lib/mockUserManager';
import UserMenu from '@/components/UserMenu';
import {
  getChatMessages,
  sendChatMessage,
  subscribeToChatMessages,
  type ChatMessage,
} from '@/lib/chatManager';
import {
  getChatMessagesMock,
  sendChatMessageMock,
  subscribeToChatMessagesMock,
  sendAiMessageMock,
  generateAiResponseMock,
} from '@/lib/mockChatManager';
import type { User } from '@/types/user';

export default function Chat() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
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
        // Try Supabase first
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
        console.warn('Supabase failed, using mock mode:', error);
        setIsMockMode(true);

        // Fallback to mock mode
        const currentUser = await getOrCreateUserMock();
        setUser(currentUser);

        const existingMessages = await getChatMessagesMock(challenge.id);
        setMessages(existingMessages);
        setIsLoading(false);

        // Subscribe to mock updates
        const channel = subscribeToChatMessagesMock(challenge.id, (newMsg) => {
          setMessages(prev => [...prev, newMsg]);
        });

        return () => {
          channel.unsubscribe();
        };
      }
    };

    init();
  }, [challenge.id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || isSending) return;

    setIsSending(true);

    try {
      if (isMockMode) {
        // Mock mode
        await sendChatMessageMock(
          challenge.id,
          user.anonymousId,
          newMessage.trim(),
          user.displayName
        );
        setNewMessage('');

        // Trigger mock AI after every 3 messages
        if (messages.length % 3 === 2) {
          setTimeout(async () => {
            const aiResponse = await generateAiResponseMock(messages);
            await sendAiMessageMock(challenge.id, aiResponse);
          }, 1500);
        }
      } else {
        // Real mode
        await sendChatMessage(
          challenge.id,
          user.anonymousId,
          newMessage.trim(),
          user.displayName
        );
        setNewMessage('');

        // Trigger AI facilitator after every 5 messages
        if (messages.length % 5 === 4) {
          fetch('/api/ai-facilitate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ challengeId: challenge.id }),
          }).catch(console.error);
        }
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
      {/* User menu */}
      <UserMenu />

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
              <h1 className="text-3xl font-bold text-ocean-white flex items-center gap-3" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                <span className="text-4xl">{challenge.icon}</span>
                Live Chat
              </h1>
              <p className="text-ocean-white/85 font-medium mt-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Today's challenge: {challenge.title}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.a
                href="/daily"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-5 py-2 rounded-full font-bold text-ocean-white text-sm soft-shadow hover:glow transition-all"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              >
                📸 Challenge
              </motion.a>
              <motion.a
                href="/feed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-5 py-2 rounded-full font-bold text-ocean-white text-sm soft-shadow hover:glow transition-all"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              >
                🎨 Feed
              </motion.a>
            </div>
          </div>
          {user && (
            <p className="text-sm text-ocean-white/80 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Chatting as <span className="font-bold text-ocean-white">{user.displayName}</span>
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
              <h2 className="text-2xl font-bold text-ocean-white mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                Start the conversation!
              </h2>
              <p className="text-ocean-white/85 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
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
                          <p className="font-bold text-jellyfish-pink text-sm mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                            AI Facilitator
                          </p>
                          <p className="text-ocean-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // User message
                    <div className="glass px-6 py-4 rounded-3xl soft-shadow max-w-2xl">
                      <p className="font-bold text-ocean-white text-sm mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                        {msg.displayName || 'Anonymous Human'}
                      </p>
                      <p className="text-ocean-white/90 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{msg.message}</p>
                      <p className="text-xs text-ocean-white/60 font-medium mt-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
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
              className="flex-1 px-6 py-4 rounded-full bg-white/50 border border-water/20 focus:border-water focus:outline-none text-deep-sea font-medium placeholder:text-deep-sea-light/70"
              disabled={isSending}
            />
            <motion.button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-bold text-ocean-white soft-shadow hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
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
          className="text-sm text-ocean-white/80 font-medium hover:text-ocean-white underline"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          ← Back to home
        </a>
      </div>
    </div>
  );
}
