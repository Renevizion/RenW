'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { AIInfluencer } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<AIInfluencer | null>(null);

  useEffect(() => {
    const loadInfluencers = () => {
      const data = storage.getInfluencers();
      setInfluencers(data);
      if (data.length > 0 && !selectedInfluencer) {
        setSelectedInfluencer(data[0]);
      }
    };

    loadInfluencers();
  }, []);

  const handleCreateNew = () => {
    router.push('/influencer/create');
  };

  const handleOpenWorkspace = (influencer: AIInfluencer) => {
    router.push(`/workspace/${influencer.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              RenW Dashboard
            </h1>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              + New Influencer
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {influencers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No AI Influencers Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first AI influencer to get started
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create Your First Influencer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {influencer.name}
                    </h3>
                    <p className="text-sm text-purple-600 font-medium">
                      {influencer.niche}
                    </p>
                  </div>
                  <div className="text-2xl">🎭</div>
                </div>

                {influencer.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {influencer.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {influencer.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {platform === 'youtube' && '📺 YouTube'}
                      {platform === 'instagram' && '📸 Instagram'}
                      {platform === 'tiktok' && '🎵 TikTok'}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleOpenWorkspace(influencer)}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Open Workspace
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
