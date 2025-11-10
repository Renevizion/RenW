# RenW - AI Influencer Workspace

A modern web application for managing AI influencers and creating content across multiple social media platforms.

## Features

### 🎭 AI Influencer Management
- Create and manage multiple AI influencers
- Define influencer niche/category (Fashion, Tech, Gaming, etc.)
- Select target social media platforms (YouTube, Instagram, TikTok)
- Store influencer profiles locally

### 🎨 Creative Workspace
- **Generate Content**: Create new content with AI assistance (Nano Banana)
- **Manage Creatives**: View and organize all your saved content
- **Post to Platforms**: Publish content to YouTube, Instagram, and TikTok

### 🚀 Onboarding Experience
- 3-step guided onboarding for first-time users
- Option to skip and explore the app
- Create your first AI influencer instantly

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Renevizion/RenW.git
cd RenW
```

2. Install dependencies:
```bash
npm install
```

3. Configure the Nano Banana AI (via Kie.ai):
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Kie.ai API key:
```
NEXT_PUBLIC_KIE_AI_API_KEY=your_api_key_here
```

> **Note**: Get your API key from [kie.ai](https://kie.ai). The app will work with mock data if the API key is not configured.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **UI**: React 19
- **Styling**: Tailwind CSS 3.4
- **Storage**: Local Storage (client-side)

## Application Structure

```
RenW/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Main dashboard
│   ├── influencer/create/   # New influencer creation
│   ├── onboarding/          # First-time user onboarding
│   ├── workspace/[id]/      # Influencer workspace
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/routing page
│   └── globals.css          # Global styles
├── lib/                     # Utility libraries
│   ├── types.ts            # TypeScript interfaces
│   ├── storage.ts          # Local storage utilities
│   └── kieai.ts            # Kie.ai API integration
├── components/             # Reusable React components
├── public/                 # Static assets
└── .env.example            # Environment variables template
```

## Nano Banana AI Integration

The application integrates with **Nano Banana** AI through [Kie.ai](https://kie.ai) for intelligent content generation. 

### Setup
1. Sign up at [kie.ai](https://kie.ai) to get your API key
2. Copy `.env.example` to `.env.local`
3. Add your API key: `NEXT_PUBLIC_KIE_AI_API_KEY=your_key`

### Features
- **Smart Content Generation**: Generates engaging social media content tailored to your influencer's niche
- **Context-Aware**: Uses influencer name, niche, and optional title for personalized content
- **Graceful Fallback**: Automatically uses mock generation if API is unavailable

### Usage
In the workspace, click "✨ Generate with Nano Banana" to create AI-powered content. The system will:
1. Send a request to Kie.ai with your influencer's context
2. Generate creative, platform-appropriate content
3. Fall back to sample content if the API is unavailable

## Features in Detail

### Onboarding Flow
1. **Create Your First Influencer**: Enter name and niche
2. **Select Platforms**: Choose YouTube, Instagram, and/or TikTok
3. **Add Description**: Optional details about your influencer

### Dashboard
- View all your AI influencers in card format
- Create new influencers
- Quick access to each influencer's workspace

### Workspace Tabs
1. **Create Content**: 
   - Generate AI-powered content with Nano Banana
   - Edit and customize content manually
   - Select target platforms
   
2. **My Creatives**: 
   - Browse all saved content
   - View creation dates and target platforms
   
3. **Post Content**: 
   - Select creatives to publish
   - Post to individual platforms with one click

## Data Persistence

The application uses browser Local Storage to persist:
- AI influencer profiles
- Created content/creatives
- Onboarding completion status

**Note**: Data is stored locally in your browser and will be cleared if you clear browser data.

## Future Enhancements

- [ ] Real API integrations with YouTube, Instagram, TikTok
- [ ] Actual AI content generation (replace simulation)
- [ ] Cloud storage and user authentication
- [ ] Analytics and performance tracking
- [ ] Scheduling posts for future publication
- [ ] Media upload and editing capabilities
- [ ] Team collaboration features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Renevizion