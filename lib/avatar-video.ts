import { ShotType } from './types';

interface GenerateAvatarRequest {
  influencerName: string;
  niche: string;
  shotType: ShotType;
  customAngles?: string;
}

interface GenerateAvatarResponse {
  imageUrl?: string;
  error?: string;
}

interface GenerateVideoRequest {
  influencerName: string;
  niche: string;
  type: 'avatar' | 'content';
  content?: string;
  avatarImageUrl?: string;
}

interface GenerateVideoResponse {
  videoUrl?: string;
  error?: string;
}

export async function generateAvatar({
  influencerName,
  niche,
  shotType,
  customAngles,
}: GenerateAvatarRequest): Promise<GenerateAvatarResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_KIE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('KIE_AI_API_KEY is not configured. Please add it to your .env.local file.');
    }

    // Construct prompt for avatar generation
    let prompt = `Generate a professional AI influencer avatar image for ${influencerName}, who is a ${niche} influencer. `;
    
    if (shotType === 'upclose') {
      prompt += 'Create an up-close headshot with clear facial features and expression.';
    } else if (shotType === 'mid') {
      prompt += 'Create a mid-shot showing from waist up, with engaging pose and background.';
    } else if (shotType === 'custom') {
      prompt += `Custom angle request: ${customAngles || 'creative and unique angle'}`;
    }

    const response = await fetch('https://api.kie.ai/v1/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: 'nano-banana-vision',
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      imageUrl: data.url || data.image_url || '',
    };
  } catch (error) {
    console.error('Error generating avatar:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to generate avatar',
    };
  }
}

export async function generateVideo({
  influencerName,
  niche,
  type,
  content,
  avatarImageUrl,
}: GenerateVideoRequest): Promise<GenerateVideoResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_KIE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('KIE_AI_API_KEY is not configured. Please add it to your .env.local file.');
    }

    let prompt = '';
    
    if (type === 'avatar') {
      prompt = `Generate a video of the AI influencer ${influencerName} (${niche} influencer) introducing themselves. Create an engaging, professional video.`;
    } else {
      prompt = `Generate a video for ${influencerName}, a ${niche} influencer, with the following content: ${content}. Make it engaging and platform-appropriate.`;
    }

    const response = await fetch('https://api.kie.ai/v1/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: 'nano-banana-video',
        duration: 30, // 30 seconds
        image_url: avatarImageUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      videoUrl: data.url || data.video_url || '',
    };
  } catch (error) {
    console.error('Error generating video:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to generate video',
    };
  }
}
