import { SubscriptionFeatures } from './types';

// Subscription features by tier
export const SUBSCRIPTION_FEATURES: Record<string, SubscriptionFeatures> = {
  free: {
    stateSpecificScripts: false,
    advancedRecording: false,
    alertSystem: false,
    aiSummaries: false,
    multiLanguage: false,
  },
  premium: {
    stateSpecificScripts: true,
    advancedRecording: true,
    alertSystem: true,
    aiSummaries: true,
    multiLanguage: true,
  },
};

// US States for legal guides
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Basic constitutional rights
export const BASIC_RIGHTS = [
  'You have the right to remain silent',
  'You have the right to refuse searches',
  'You have the right to an attorney',
  'You have the right to leave if not detained',
  'You have the right to record police interactions',
];

// Emergency scripts
export const EMERGENCY_SCRIPTS = {
  en: {
    detained: "Am I free to leave? If not, I am invoking my right to remain silent and I want to speak to a lawyer.",
    search: "I do not consent to any searches. I am exercising my constitutional rights.",
    recording: "I am recording this interaction for my safety and legal protection.",
    identification: "I am providing my identification as required by law, but I am exercising my right to remain silent otherwise.",
  },
  es: {
    detained: "¿Soy libre de irme? Si no, estoy invocando mi derecho a permanecer en silencio y quiero hablar con un abogado.",
    search: "No consiento a ningún registro. Estoy ejerciendo mis derechos constitucionales.",
    recording: "Estoy grabando esta interacción para mi seguridad y protección legal.",
    identification: "Estoy proporcionando mi identificación según lo requiere la ley, pero estoy ejerciendo mi derecho a permanecer en silencio de lo contrario.",
  },
};

// Pricing
export const PRICING = {
  premium: {
    monthly: 4.99,
    currency: 'USD',
  },
};
