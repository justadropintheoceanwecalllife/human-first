'use client';

import UserMenu from './UserMenu';

interface HeaderProps {
  icon?: string;
  title?: string;
}

export default function Header({ icon = '🌊', title = 'human-first' }: HeaderProps) {
  return (
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
              {icon}
            </div>
            <span className="text-xl font-bold text-ocean-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              {title}
            </span>
          </div>
        </div>
        <UserMenu />
      </div>
    </div>
  );
}
