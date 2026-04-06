'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/singpass';
import { motion } from 'framer-motion';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }

    // Check authentication
    const authenticated = isAuthenticated();

    if (!authenticated) {
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Show loading while checking auth
  if (isChecking && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl"
        >
          🌊
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
