'use client';

import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

export default function HomeHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/daily', label: '📸 Daily', icon: '📸' },
    { href: '/hands-on', label: '🎯 Activities', icon: '🎯' },
    { href: '/gallery', label: '🎨 Gallery', icon: '🎨' },
    { href: '/chat', label: '💭 Chat', icon: '💭' },
    { href: '/leaderboard', label: '🏆 Leaderboard', icon: '🏆' },
    { href: '/bulletin', label: '📌 Bulletin', icon: '📌' },
  ];

  return (
    <div className="sticky top-0 z-50 glass border-b border-ocean-white/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-jellyfish-pink/30 flex items-center justify-center text-xl">
            🌊
          </div>
          <span className="text-xl font-bold text-ocean-white hidden sm:inline" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
            human-first
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                pathname === link.href
                  ? 'glass text-ocean-white border border-ocean-white/40'
                  : 'text-ocean-white/70 hover:text-ocean-white hover:bg-ocean-white/10'
              }`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            >
              <span className="md:hidden">{link.icon}</span>
              <span className="hidden md:inline">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* User Menu */}
        <UserMenu />
      </div>
    </div>
  );
}
