'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { AIInfluencer, Platform } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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

  const handleSkip = () => {
    storage.skipOnboarding();
    router.push('/dashboard');
  };

  const handleCreateInfluencer = () => {
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
    storage.completeOnboarding();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to RenW! 🎉
          </h1>
          <p className="text-gray-600">
            Your AI Influencer Workspace
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-300'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  step >= 2 ? 'bg-purple-500' : 'bg-gray-300'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-300'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  step >= 3 ? 'bg-purple-500' : 'bg-gray-300'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-purple-500 text-white' : 'bg-gray-300'
                }`}>
                  3
                </div>
              </div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create Your First AI Influencer
            </h2>
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
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!name || !niche}
                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Select Platforms
            </h2>
            <p className="text-gray-600">
              Choose where you want to publish content for {name}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
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
            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedPlatforms.length === 0}
                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add a Description
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us more about your AI influencer..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
              />
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Summary:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Name: {name}</li>
                <li>• Niche: {niche}</li>
                <li>• Platforms: {selectedPlatforms.join(', ')}</li>
              </ul>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateInfluencer}
                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create Influencer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
