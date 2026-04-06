'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/singpass';
import { isBulletinAdmin } from '@/lib/adminConfig';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const adminStatus = isBulletinAdmin(currentUser.nric, currentUser.email);
      setIsAdmin(adminStatus);
    }
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="bg-white p-4 rounded-lg text-black">
        <h2 className="font-bold mb-2">Current User:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        <h2 className="font-bold mt-4 mb-2">Is Admin:</h2>
        <p>{isAdmin ? 'YES' : 'NO'}</p>

        <h2 className="font-bold mt-4 mb-2">Admin Config Check:</h2>
        <p>NRIC: {user?.nric}</p>
        <p>Email: {user?.email}</p>
      </div>
    </div>
  );
}
