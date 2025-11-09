'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = () => {
      const isCompleted = storage.isOnboardingCompleted();
      const influencers = storage.getInfluencers();

      if (!isCompleted && influencers.length === 0) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    };

    checkOnboarding();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="text-white text-2xl font-bold">
        Loading RenW...
      </div>
    </div>
  );
}
