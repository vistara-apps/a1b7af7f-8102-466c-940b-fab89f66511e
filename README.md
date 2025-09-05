# KnowYourRightsCard - Base Mini App

A mobile-first application providing instant, understandable legal guidance and documentation tools for citizens encountering law enforcement.

## Features

### Core Features
- **Know Your Rights Guides**: Mobile-optimized guides detailing constitutional rights and police encounter procedures
- **State-Specific Laws & Scripts**: Tailored legal information and dialogue prompts for different US jurisdictions
- **Quick Record & Share**: One-tap recording with shareable summaries
- **Location-Based Alert System**: Discreet alerts to trusted contacts with real-time location

### Technical Features
- Built with Next.js 15 and App Router
- Base blockchain integration via OnchainKit
- Mobile-first responsive design
- TypeScript for type safety
- Tailwind CSS with custom design system
- Real-time location services
- Audio/video recording capabilities

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Base wallet for testing

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd knowyourrightscard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
- `OPENAI_API_KEY`: OpenAI API key for AI-generated content
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main homepage
│   ├── providers.tsx      # MiniKitProvider setup
│   ├── globals.css        # Global styles with Tailwind
│   ├── loading.tsx        # Loading UI
│   └── error.tsx          # Error boundary
├── components/            # Reusable UI components
│   ├── NavHeader.tsx      # Navigation header
│   ├── GuideCard.tsx      # Legal guide cards
│   ├── ActionButton.tsx   # Styled action buttons
│   ├── RecordButton.tsx   # Recording interface
│   ├── MetricCard.tsx     # Statistics cards
│   ├── FeatureGrid.tsx    # Feature overview grid
│   ├── QuickActions.tsx   # Emergency action panel
│   └── RightsGuide.tsx    # Rights information display
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript type definitions
│   ├── constants.ts       # App constants and data
│   └── utils.ts           # Utility functions
└── public/               # Static assets
```

## Key Components

### MiniKit Integration
The app uses OnchainKit's MiniKitProvider for Base blockchain integration:

```tsx
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'wagmi/chains';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider
      chain={base}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
    >
      {children}
    </MiniKitProvider>
  );
}
```

### Recording System
The QuickActions component provides one-tap recording with location capture:

```tsx
const handleToggleRecording = async () => {
  if (!isRecording) {
    const locationData = await getCurrentLocation();
    setLocation({ lat: locationData.latitude, lng: locationData.longitude });
    setIsRecording(true);
  } else {
    setIsRecording(false);
    // Save recording and generate summary
  }
};
```

### Rights Guide System
Expandable sections for different types of legal information:

```tsx
<RightsGuide />
```

## Business Model

- **Free Tier**: Basic constitutional rights guides
- **Premium Tier ($4.99/month)**: 
  - State-specific laws and scripts
  - Advanced recording features
  - Location-based alert system
  - AI-generated summaries
  - Multi-language support

## API Integration

### Required APIs
- **OpenAI**: AI-generated legal summaries and translations
- **Supabase**: Backend database and authentication
- **Geolocation API**: Location services for alerts and state-specific content
- **Stripe**: Payment processing for subscriptions

### Optional Integrations
- **Farcaster**: Social sharing and community features
- **Turnkey/Privy**: Advanced wallet management

## Design System

The app uses a custom design system with:
- **Colors**: Purple-to-pink gradient background with glass morphism cards
- **Typography**: Inter font with responsive sizing
- **Components**: Modular, reusable components with consistent styling
- **Motion**: Smooth transitions with 200ms duration
- **Layout**: 12-column fluid grid with responsive breakpoints

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Legal Disclaimer

This app provides general legal information and should not be considered legal advice. Users should consult with qualified attorneys for specific legal situations. The app is designed to help users understand their constitutional rights but cannot guarantee legal outcomes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@knowyourrightscard.com or create an issue in the GitHub repository.
