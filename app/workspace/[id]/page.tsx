'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { AIInfluencer, Creative, Platform } from '@/lib/types';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const influencerId = params.id as string;

  const [influencer, setInfluencer] = useState<AIInfluencer | null>(null);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'creatives' | 'post'>('create');
  
  // Creative creation state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const influencers = storage.getInfluencers();
      const found = influencers.find(i => i.id === influencerId);
      
      if (!found) {
        router.push('/dashboard');
        return;
      }

      setInfluencer(found);
      setSelectedPlatforms(found.platforms);
      
      const userCreatives = storage.getCreatives(influencerId);
      setCreatives(userCreatives);
    };

    loadData();
  }, [influencerId, router]);

  const handleGenerateCreative = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const suggestions = [
        `Exciting news for ${influencer?.niche} enthusiasts! 🎉`,
        `Check out this amazing ${influencer?.niche} content! 🚀`,
        `New trends in ${influencer?.niche} you don't want to miss! ✨`,
        `Breaking: The future of ${influencer?.niche} is here! 🌟`,
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setContent(randomSuggestion);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveCreative = () => {
    if (!title || !content) {
      alert('Please fill in title and content');
      return;
    }

    const creative: Creative = {
      id: Date.now().toString(),
      influencerId,
      title,
      content,
      createdAt: new Date(),
      platforms: selectedPlatforms,
    };

    storage.saveCreative(creative);
    setCreatives([...creatives, creative]);
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedPlatforms(influencer?.platforms || []);
    
    alert('Creative saved successfully!');
    setActiveTab('creatives');
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePost = (creative: Creative, platform: Platform) => {
    alert(`Posting "${creative.title}" to ${platform}!\n\nNote: This is a demo. In production, this would connect to ${platform} API.`);
  };

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {influencer.name}'s Workspace
                </h1>
                <p className="text-sm text-gray-600">{influencer.niche}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎨 Create Content
            </button>
            <button
              onClick={() => setActiveTab('creatives')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'creatives'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📁 My Creatives ({creatives.length})
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'post'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📤 Post Content
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create New Content
                </h2>
                <p className="text-gray-600">
                  Generate and edit creatives with Nano Banana AI ✨
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your content..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <button
                    onClick={handleGenerateCreative}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? '🔄 Generating...' : '✨ Generate with Nano Banana'}
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content or generate with AI..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Platforms
                </label>
                <div className="flex flex-wrap gap-3">
                  {influencer.platforms.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedPlatforms.includes(platform)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {platform === 'youtube' && '📺 YouTube'}
                      {platform === 'instagram' && '📸 Instagram'}
                      {platform === 'tiktok' && '🎵 TikTok'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setSelectedPlatforms(influencer.platforms);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleSaveCreative}
                  className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Save Creative
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creatives' && (
          <div>
            {creatives.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Creatives Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Create your first creative to get started
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Create Content
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creatives.map((creative) => (
                  <div
                    key={creative.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {creative.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {creative.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {creative.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                        >
                          {platform === 'youtube' && '📺 YouTube'}
                          {platform === 'instagram' && '📸 Instagram'}
                          {platform === 'tiktok' && '🎵 TikTok'}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(creative.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'post' && (
          <div>
            {creatives.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="text-6xl mb-4">📤</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Creatives to Post
                </h2>
                <p className="text-gray-600 mb-6">
                  Create some creatives first before posting
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Create Content
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Post to Social Media
                  </h2>
                  <p className="text-gray-600">
                    Select a creative and platform to publish
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {creatives.map((creative) => (
                    <div
                      key={creative.id}
                      className="bg-white rounded-xl shadow-md p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {creative.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {creative.content}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {creative.platforms.map((platform) => (
                          <button
                            key={platform}
                            onClick={() => handlePost(creative, platform)}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                          >
                            <span>
                              {platform === 'youtube' && '📺'}
                              {platform === 'instagram' && '📸'}
                              {platform === 'tiktok' && '🎵'}
                            </span>
                            <span>Post to {platform}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
