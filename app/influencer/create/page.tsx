'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { AIInfluencer, Platform } from '@/lib/types';

export default function CreateInfluencerPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  const platforms: { value: Platform; label: string; emoji: string }[] = [
    { value: 'youtube', label: 'YouTube', emoji: '📺' },
    { value: 'instagram', label: 'Instagram', emoji: '📸' },
    { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
  ];

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !niche || selectedPlatforms.length === 0) {
      alert('Please fill in all required fields and select at least one platform');
      return;
    }

    const influencer: AIInfluencer = {
      id: Date.now().toString(),
      name,
      niche,
      description,
      platforms: selectedPlatforms,
      createdAt: new Date(),
    };

    storage.saveInfluencer(influencer);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New AI Influencer
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Influencer Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Luna AI"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niche/Category *
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Fashion, Tech, Gaming, Lifestyle"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about your AI influencer..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platforms *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => togglePlatform(platform.value)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.value)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{platform.emoji}</div>
                  <div className="text-sm font-medium text-gray-800">
                    {platform.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create Influencer
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
