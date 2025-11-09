import { AIInfluencer, Creative } from './types';

const INFLUENCERS_KEY = 'ai_influencers';
const CREATIVES_KEY = 'ai_creatives';
const ONBOARDING_KEY = 'onboarding_completed';

export const storage = {
  getInfluencers: (): AIInfluencer[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(INFLUENCERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveInfluencer: (influencer: AIInfluencer): void => {
    if (typeof window === 'undefined') return;
    const influencers = storage.getInfluencers();
    const existingIndex = influencers.findIndex(i => i.id === influencer.id);
    
    if (existingIndex >= 0) {
      influencers[existingIndex] = influencer;
    } else {
      influencers.push(influencer);
    }
    
    localStorage.setItem(INFLUENCERS_KEY, JSON.stringify(influencers));
  },

  deleteInfluencer: (id: string): void => {
    if (typeof window === 'undefined') return;
    const influencers = storage.getInfluencers().filter(i => i.id !== id);
    localStorage.setItem(INFLUENCERS_KEY, JSON.stringify(influencers));
  },

  getCreatives: (influencerId?: string): Creative[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CREATIVES_KEY);
    const creatives = data ? JSON.parse(data) : [];
    return influencerId 
      ? creatives.filter((c: Creative) => c.influencerId === influencerId)
      : creatives;
  },

  saveCreative: (creative: Creative): void => {
    if (typeof window === 'undefined') return;
    const creatives = storage.getCreatives();
    const existingIndex = creatives.findIndex(c => c.id === creative.id);
    
    if (existingIndex >= 0) {
      creatives[existingIndex] = creative;
    } else {
      creatives.push(creative);
    }
    
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(creatives));
  },

  deleteCreative: (id: string): void => {
    if (typeof window === 'undefined') return;
    const creatives = storage.getCreatives().filter(c => c.id !== id);
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(creatives));
  },

  isOnboardingCompleted: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },

  completeOnboarding: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },

  skipOnboarding: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_KEY, 'true');
  }
};
