interface GenerateContentRequest {
  prompt: string;
  influencerName: string;
  niche: string;
  title?: string;
}

interface GenerateContentResponse {
  content: string;
  error?: string;
}

export async function generateContentWithKieAI({
  prompt,
  influencerName,
  niche,
  title,
}: GenerateContentRequest): Promise<GenerateContentResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_KIE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('KIE_AI_API_KEY is not configured. Please add it to your .env.local file.');
    }

    // Construct a detailed prompt for Nano Banana
    const fullPrompt = title 
      ? `Generate engaging social media content for "${title}". The content is for ${influencerName}, an AI influencer in the ${niche} niche. ${prompt}`
      : `Generate engaging social media content for ${influencerName}, an AI influencer in the ${niche} niche. ${prompt}`;

    const response = await fetch('https://api.kie.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        model: 'nano-banana', // Using Nano Banana model
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.content || data.text || data.generated_text || '',
    };
  } catch (error) {
    console.error('Error generating content with Kie.AI:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Failed to generate content',
    };
  }
}
