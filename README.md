# KnowYourRightsCard - Production-Ready Base Mini App

A comprehensive, mobile-first application providing instant, understandable legal guidance and documentation tools for citizens encountering law enforcement. Built for production deployment with full database integration, payment processing, and real-time features.

## 🚀 Features

### Core Features
- **Know Your Rights Guides**: Mobile-optimized guides detailing constitutional rights and police encounter procedures
- **State-Specific Laws & Scripts**: Tailored legal information and dialogue prompts for different US jurisdictions (English & Spanish)
- **Quick Record & Share**: One-tap audio recording with AI-generated summaries
- **Location-Based Alert System**: Emergency alerts to trusted contacts with real-time location
- **Premium Subscriptions**: Stripe-powered subscription system with advanced features

### Production Features
- **Full Database Integration**: Supabase PostgreSQL with Row Level Security
- **User Authentication**: Wallet-based authentication with persistent user profiles
- **Payment Processing**: Complete Stripe integration with webhooks
- **Real-time Location Services**: GPS-based location with geocoding
- **AI-Powered Summaries**: OpenAI/OpenRouter integration for encounter analysis
- **Emergency Alert System**: SMS/Email notifications to emergency contacts
- **Multi-language Support**: English and Spanish content
- **Progressive Web App**: Offline capabilities and mobile optimization

### Technical Features
- Built with Next.js 15 and App Router
- Base blockchain integration via OnchainKit MiniKit
- TypeScript for complete type safety
- Tailwind CSS with custom design system
- React Query for state management
- Custom React hooks for data management
- Comprehensive error handling and validation
- Production-ready API endpoints

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
cp .env.example .env.local
```

Fill in your API keys:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY`: For AI-generated summaries

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # App providers
├── components/            # React components
│   ├── ActionButton.tsx   # Reusable button component
│   ├── AlertSystem.tsx    # Emergency alert system
│   ├── GuideCard.tsx      # Legal guide cards
│   ├── NavHeader.tsx      # Navigation header
│   ├── RecordButton.tsx   # Recording interface
│   └── RightsGuide.tsx    # Constitutional rights guide
├── lib/                   # Utilities and types
│   ├── constants.ts       # App constants
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/               # Static assets
```

## Key Components

### Data Models
- **User**: User profile with subscription status and preferences
- **Encounter**: Police encounter records with location and metadata
- **LegalGuide**: State-specific legal information and scripts
- **AlertContact**: Emergency contact information

### Core Features Implementation

#### Recording System
- One-tap recording with visual feedback
- Duration tracking and formatting
- Audio/video capture capabilities
- AI-generated encounter summaries

#### Alert System
- Location-based emergency alerts
- Trusted contact management
- Real-time notification system
- Integration with SMS/email services

#### Legal Guides
- State-specific legal information
- Multi-language support (English/Spanish)
- Premium content gating
- Interactive scripts and phrases

## Business Model

- **Free Tier**: Basic constitutional rights guides
- **Premium Tier** ($4.99/month): 
  - State-specific scripts and laws
  - Advanced recording features
  - Emergency alert system
  - AI-generated summaries

## API Integration

### OpenAI/OpenRouter
- AI-generated encounter summaries
- Content translation
- Legal script generation

### Base Blockchain
- User authentication via wallet
- Potential future tokenization
- Decentralized identity management

### Location Services
- Real-time location tracking
- State-specific content delivery
- Emergency alert positioning

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Environment Variables
See `.env.example` for required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Legal Disclaimer

This app provides general legal information and should not be considered legal advice. Users should consult with qualified attorneys for specific legal situations. The app is designed to help users understand their constitutional rights but does not guarantee legal outcomes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [support@knowyourrightscard.com] or create an issue in this repository.
