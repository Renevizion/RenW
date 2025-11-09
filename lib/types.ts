export interface AIInfluencer {
  id: string;
  name: string;
  niche: string;
  description: string;
  platforms: Platform[];
  createdAt: Date;
}

export type Platform = 'youtube' | 'instagram' | 'tiktok';

export interface Creative {
  id: string;
  influencerId: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  platforms: Platform[];
}
