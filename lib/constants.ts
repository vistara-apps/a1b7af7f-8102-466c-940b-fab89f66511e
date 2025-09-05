// US States for legal guide selection
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// Basic constitutional rights
export const BASIC_RIGHTS = [
  {
    title: "Right to Remain Silent",
    content: "You have the right to remain silent. Anything you say can and will be used against you in a court of law.",
    script: "I am exercising my right to remain silent."
  },
  {
    title: "Right to an Attorney",
    content: "You have the right to an attorney. If you cannot afford an attorney, one will be provided for you.",
    script: "I want to speak to my attorney before answering any questions."
  },
  {
    title: "Right to Refuse Searches",
    content: "You have the right to refuse consent to searches of your person, vehicle, or home without a warrant.",
    script: "I do not consent to any searches."
  },
  {
    title: "Right to Leave",
    content: "If you are not under arrest, you have the right to leave. Ask clearly if you are free to go.",
    script: "Am I free to leave? Am I under arrest?"
  }
];

// Emergency phrases in multiple languages
export const EMERGENCY_PHRASES = {
  en: {
    recording: "I am recording this interaction for my safety and legal protection.",
    silent: "I am exercising my right to remain silent.",
    attorney: "I want to speak to my attorney.",
    search: "I do not consent to any searches.",
    leave: "Am I free to leave?",
    medical: "I need medical attention.",
    emergency: "This is an emergency. Please send help to my location."
  },
  es: {
    recording: "Estoy grabando esta interacción para mi seguridad y protección legal.",
    silent: "Estoy ejerciendo mi derecho a permanecer en silencio.",
    attorney: "Quiero hablar con mi abogado.",
    search: "No consiento a ningún registro.",
    leave: "¿Soy libre de irme?",
    medical: "Necesito atención médica.",
    emergency: "Esta es una emergencia. Por favor envíen ayuda a mi ubicación."
  }
};
