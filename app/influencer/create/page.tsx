'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { AIInfluencer, Platform, ShotType, AvatarConfig } from '@/lib/types';
import { generateAvatar } from '@/lib/avatar-video';

export default function CreateInfluencerPage() {
  const router = useRouter();
  const [step, setStep] = useState<'basic' | 'avatar' | 'review'>(    'basic');
  
  // Basic info
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  
  // Avatar generation
  const [shotType, setShotType] = useState<ShotType>('mid');
  const [customAngles, setCustomAngles] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<AvatarConfig | null>(null);

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

  const handleBasicInfoNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !niche || selectedPlatforms.length === 0) {
      alert('Please fill in all required fields and select at least one platform');
      return;
    }

    setStep('avatar');
  };

  const handleGenerateAvatar = async () => {
    if (!name || !niche) return;

    setIsGeneratingAvatar(true);

    try {
      const result = await generateAvatar({
        influencerName: name,
        niche,
        shotType,
        customAngles: shotType === 'custom' ? customAngles : undefined,
      });

      if (result.error) {
        // Use placeholder/mock avatar
        console.warn('Avatar generation failed, using placeholder:', result.error);
        const mockImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        setGeneratedAvatar({
          id: Date.now().toString(),
          shotType,
          customAngles: shotType === 'custom' ? customAngles : undefined,
          imageUrl: mockImageUrl,
          approved: false,
          createdAt: new Date(),
        });
        alert(`Note: ${result.error}\n\nUsing placeholder avatar instead.`);
      } else {
        setGeneratedAvatar({
          id: Date.now().toString(),
          shotType,
          customAngles: shotType === 'custom' ? customAngles : undefined,
          imageUrl: result.imageUrl,
          approved: false,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      // Use placeholder/mock avatar
      const mockImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
      setGeneratedAvatar({
        id: Date.now().toString(),
        shotType,
        customAngles: shotType === 'custom' ? customAngles : undefined,
        imageUrl: mockImageUrl,
        approved: false,
        createdAt: new Date(),
      });
      alert('Failed to connect to avatar generation service. Using placeholder avatar instead.');
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleApproveAvatar = () => {
    if (!generatedAvatar) return;
    
    setGeneratedAvatar({
      ...generatedAvatar,
      approved: true,
    });
    setStep('review');
  };

  const handleRejectAvatar = () => {
    setGeneratedAvatar(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !niche || selectedPlatforms.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const influencer: AIInfluencer = {
      id: Date.now().toString(),
      name,
      niche,
      description,
      platforms: selectedPlatforms,
      createdAt: new Date(),
      avatar: generatedAvatar || undefined,
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
          {/* Step indicator */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'basic' ? 'text-purple-600' : step === 'avatar' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'basic' ? 'bg-purple-100 border-2 border-purple-600' : step === 'avatar' || step === 'review' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Basic Info</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step === 'avatar' ? 'text-purple-600' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'avatar' ? 'bg-purple-100 border-2 border-purple-600' : step === 'review' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Generate Avatar</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step === 'review' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-purple-100 border-2 border-purple-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'basic' && (
          <form onSubmit={handleBasicInfoNext} className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            </div>
            
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
                Next: Generate Avatar
              </button>
            </div>
          </form>
        )}

        {step === 'avatar' && (
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Generate AI Avatar</h2>
              <p className="text-gray-600">Choose a shot type and generate your AI influencer's avatar</p>
            </div>

            {!generatedAvatar ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Shot Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setShotType('upclose')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        shotType === 'upclose'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">📸</div>
                      <div className="text-sm font-medium text-gray-800">Up Close</div>
                      <div className="text-xs text-gray-600 mt-1">Headshot</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShotType('mid')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        shotType === 'mid'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-sm font-medium text-gray-800">Mid Shot</div>
                      <div className="text-xs text-gray-600 mt-1">Waist up</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShotType('custom')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        shotType === 'custom'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">🎨</div>
                      <div className="text-sm font-medium text-gray-800">Custom</div>
                      <div className="text-xs text-gray-600 mt-1">Custom angle</div>
                    </button>
                  </div>
                </div>

                {shotType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Custom Angle
                    </label>
                    <textarea
                      value={customAngles}
                      onChange={(e) => setCustomAngles(e.target.value)}
                      placeholder="e.g., Full body shot from a low angle with dramatic lighting..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
                    />
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('basic')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar}
                    className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAvatar ? '🔄 Generating Avatar...' : '✨ Generate Avatar'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <img 
                      src={generatedAvatar.imageUrl} 
                      alt="Generated Avatar" 
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Shot Type: <span className="font-medium">{generatedAvatar.shotType}</span>
                    </p>
                    {generatedAvatar.customAngles && (
                      <p className="text-sm text-gray-600 mt-1">
                        Custom Angles: {generatedAvatar.customAngles}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-center text-gray-700 font-medium mb-4">
                    Do you approve this avatar?
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleRejectAvatar}
                      className="flex-1 px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      ❌ Regenerate
                    </button>
                    <button
                      onClick={handleApproveAvatar}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      ✅ Approve & Continue
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'review' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Review Your AI Influencer</h2>
              <p className="text-gray-600">Review all details before creating</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                {generatedAvatar?.imageUrl && (
                  <img 
                    src={generatedAvatar.imageUrl} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-600">{niche}</p>
                  {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlatforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                    >
                      {platform === 'youtube' && '📺 YouTube'}
                      {platform === 'instagram' && '📸 Instagram'}
                      {platform === 'tiktok' && '🎵 TikTok'}
                    </span>
                  ))}
                </div>
              </div>

              {generatedAvatar && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Avatar Details</h4>
                  <p className="text-sm text-gray-600">
                    Shot Type: <span className="font-medium capitalize">{generatedAvatar.shotType}</span>
                    {generatedAvatar.approved && <span className="ml-2 text-green-600">✅ Approved</span>}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setStep('avatar')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create Influencer
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
