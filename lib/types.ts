export interface AIInfluencer {
  id: string;
  name: string;
  niche: string;
  description: string;
  platforms: Platform[];
  createdAt: Date;
  avatar?: AvatarConfig;
}

export type Platform = 'youtube' | 'instagram' | 'tiktok';

export type ShotType = 'upclose' | 'mid' | 'custom';

export interface AvatarConfig {
  id: string;
  shotType: ShotType;
  customAngles?: string; // Description of custom angles if shotType is 'custom'
  imageUrl?: string; // Generated avatar image URL
  approved: boolean;
  createdAt: Date;
}

export interface Creative {
  id: string;
  influencerId: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  platforms: Platform[];
}

export interface Video {
  id: string;
  influencerId: string;
  title: string;
  description: string;
  type: 'avatar' | 'content'; // Video of avatar or content
  sourceId?: string; // Creative ID if type is 'content'
  videoUrl?: string; // Generated video URL
  createdAt: Date;
  platforms: Platform[];
}
