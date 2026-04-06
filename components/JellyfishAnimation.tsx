'use client';

import { motion } from 'framer-motion';

export default function JellyfishAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Jellyfish 1 - Large, center-right */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Jellyfish bell/head */}
          <ellipse
            cx="100"
            cy="80"
            rx="60"
            ry="50"
            fill="url(#jellyfishGradient1)"
            opacity="0.6"
          />

          {/* Inner glow */}
          <ellipse
            cx="100"
            cy="75"
            rx="40"
            ry="35"
            fill="url(#jellyfishGlow1)"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.5;0.9;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Tentacles */}
          <motion.path
            d="M 70 120 Q 65 160 60 180"
            stroke="rgba(232, 180, 217, 0.4)"
            strokeWidth="2"
            fill="none"
            animate={{ d: ["M 70 120 Q 65 160 60 180", "M 70 120 Q 68 160 65 180", "M 70 120 Q 65 160 60 180"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 85 120 Q 85 165 85 185"
            stroke="rgba(232, 180, 217, 0.4)"
            strokeWidth="2"
            fill="none"
            animate={{ d: ["M 85 120 Q 85 165 85 185", "M 85 120 Q 87 165 88 185", "M 85 120 Q 85 165 85 185"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 100 125 Q 102 170 105 190"
            stroke="rgba(232, 180, 217, 0.5)"
            strokeWidth="3"
            fill="none"
            animate={{ d: ["M 100 125 Q 102 170 105 190", "M 100 125 Q 98 170 95 190", "M 100 125 Q 102 170 105 190"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 115 120 Q 115 165 115 185"
            stroke="rgba(232, 180, 217, 0.4)"
            strokeWidth="2"
            fill="none"
            animate={{ d: ["M 115 120 Q 115 165 115 185", "M 115 120 Q 113 165 112 185", "M 115 120 Q 115 165 115 185"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 130 120 Q 135 160 140 180"
            stroke="rgba(232, 180, 217, 0.4)"
            strokeWidth="2"
            fill="none"
            animate={{ d: ["M 130 120 Q 135 160 140 180", "M 130 120 Q 132 160 135 180", "M 130 120 Q 135 160 140 180"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <defs>
            <radialGradient id="jellyfishGradient1" cx="50%" cy="30%">
              <stop offset="0%" stopColor="rgba(232, 180, 217, 0.8)" />
              <stop offset="50%" stopColor="rgba(200, 148, 212, 0.6)" />
              <stop offset="100%" stopColor="rgba(74, 144, 226, 0.3)" />
            </radialGradient>
            <radialGradient id="jellyfishGlow1" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(245, 208, 232, 0.9)" />
              <stop offset="100%" stopColor="rgba(232, 180, 217, 0.3)" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Jellyfish 2 - Small, left side */}
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-32 h-32 opacity-15"
        animate={{
          y: [-15, 15, -15],
          x: [-5, 5, -5],
          rotate: [0, -3, 0, 3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="80" rx="50" ry="40" fill="url(#jellyfishGradient2)" opacity="0.7" />
          <ellipse cx="100" cy="75" rx="35" ry="28" fill="url(#jellyfishGlow2)" opacity="0.9">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
          </ellipse>

          <path d="M 70 110 Q 68 140 65 155" stroke="rgba(232, 180, 217, 0.4)" strokeWidth="1.5" fill="none">
            <animate attributeName="d" values="M 70 110 Q 68 140 65 155;M 70 110 Q 70 140 68 155;M 70 110 Q 68 140 65 155" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 85 110 Q 85 145 85 160" stroke="rgba(232, 180, 217, 0.4)" strokeWidth="1.5" fill="none">
            <animate attributeName="d" values="M 85 110 Q 85 145 85 160;M 85 110 Q 87 145 88 160;M 85 110 Q 85 145 85 160" dur="3.5s" repeatCount="indefinite" />
          </path>
          <path d="M 100 115 Q 100 150 100 165" stroke="rgba(232, 180, 217, 0.5)" strokeWidth="2" fill="none">
            <animate attributeName="d" values="M 100 115 Q 100 150 100 165;M 100 115 Q 98 150 96 165;M 100 115 Q 100 150 100 165" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M 115 110 Q 115 145 115 160" stroke="rgba(232, 180, 217, 0.4)" strokeWidth="1.5" fill="none">
            <animate attributeName="d" values="M 115 110 Q 115 145 115 160;M 115 110 Q 113 145 112 160;M 115 110 Q 115 145 115 160" dur="3.5s" repeatCount="indefinite" />
          </path>
          <path d="M 130 110 Q 132 140 135 155" stroke="rgba(232, 180, 217, 0.4)" strokeWidth="1.5" fill="none">
            <animate attributeName="d" values="M 130 110 Q 132 140 135 155;M 130 110 Q 130 140 132 155;M 130 110 Q 132 140 135 155" dur="3s" repeatCount="indefinite" />
          </path>

          <defs>
            <radialGradient id="jellyfishGradient2" cx="50%" cy="30%">
              <stop offset="0%" stopColor="rgba(232, 180, 217, 0.7)" />
              <stop offset="100%" stopColor="rgba(74, 144, 226, 0.3)" />
            </radialGradient>
            <radialGradient id="jellyfishGlow2" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(245, 208, 232, 0.8)" />
              <stop offset="100%" stopColor="rgba(232, 180, 217, 0.2)" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Jellyfish 3 - Medium, top center */}
      <motion.div
        className="absolute top-1/4 left-1/2 w-48 h-48 opacity-10"
        animate={{
          y: [-25, 25, -25],
          x: [-12, 12, -12],
          rotate: [0, 4, 0, -4, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="80" rx="55" ry="45" fill="url(#jellyfishGradient3)" opacity="0.6" />
          <ellipse cx="100" cy="75" rx="38" ry="32" fill="url(#jellyfishGlow3)" opacity="0.8">
            <animate attributeName="opacity" values="0.5;0.95;0.5" dur="3.2s" repeatCount="indefinite" />
          </ellipse>

          <defs>
            <radialGradient id="jellyfishGradient3" cx="50%" cy="30%">
              <stop offset="0%" stopColor="rgba(232, 180, 217, 0.75)" />
              <stop offset="100%" stopColor="rgba(74, 144, 226, 0.35)" />
            </radialGradient>
            <radialGradient id="jellyfishGlow3" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(245, 208, 232, 0.85)" />
              <stop offset="100%" stopColor="rgba(232, 180, 217, 0.25)" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}
