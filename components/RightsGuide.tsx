'use client';

import { useState } from 'react';
import { Shield, Volume2, Copy, Check } from 'lucide-react';
import { BASIC_RIGHTS, EMERGENCY_PHRASES } from '@/lib/constants';

interface RightsGuideProps {
  language?: 'en' | 'es';
  userIsPremium?: boolean;
}

export function RightsGuide({
  language = 'en',
  userIsPremium = false,
}: RightsGuideProps) {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);

  const phrases = EMERGENCY_PHRASES[language];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScript(id);
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-8 w-8 text-purple-300" />
          <h2 className="text-2xl font-bold text-white">
            {language === 'es' ? 'Conoce Tus Derechos' : 'Know Your Rights'}
          </h2>
        </div>
        <p className="text-purple-200">
          {language === 'es'
            ? 'Información esencial sobre tus derechos constitucionales'
            : 'Essential information about your constitutional rights'}
        </p>
      </div>

      {/* Basic Rights Cards */}
      <div className="grid gap-4">
        {BASIC_RIGHTS.map((right, index) => (
          <div
            key={index}
            className={`glass-card-dark p-4 cursor-pointer transition-all duration-200 ${
              selectedRight === index ? 'ring-2 ring-purple-400' : ''
            }`}
            onClick={() =>
              setSelectedRight(selectedRight === index ? null : index)
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {right.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3">{right.content}</p>

                {selectedRight === index && (
                  <div className="mt-4 p-3 bg-purple-500 bg-opacity-20 rounded-lg border border-purple-400 border-opacity-30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-200">
                        {language === 'es' ? 'Qué decir:' : 'What to say:'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(right.script);
                          }}
                          className="p-1 text-purple-300 hover:text-white transition-colors duration-200"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(right.script, `right-${index}`);
                          }}
                          className="p-1 text-purple-300 hover:text-white transition-colors duration-200"
                        >
                          {copiedScript === `right-${index}` ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-white font-medium">"{right.script}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Phrases */}
      <div className="glass-card-dark p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'es' ? 'Frases de Emergencia' : 'Emergency Phrases'}
        </h3>
        <div className="grid gap-3">
          {Object.entries(phrases).map(([key, phrase]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200"
            >
              <span className="text-gray-200 flex-1">"{phrase}"</span>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => speakText(phrase)}
                  className="p-2 text-purple-300 hover:text-white transition-colors duration-200"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(phrase, key)}
                  className="p-2 text-purple-300 hover:text-white transition-colors duration-200"
                >
                  {copiedScript === key ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Upgrade Prompt */}
      {!userIsPremium && (
        <div className="glass-card-dark p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            {language === 'es'
              ? 'Desbloquea Más Funciones'
              : 'Unlock More Features'}
          </h3>
          <p className="text-gray-300 mb-4">
            {language === 'es'
              ? 'Obtén guías específicas por estado, scripts avanzados y más'
              : 'Get state-specific guides, advanced scripts, and more'}
          </p>
          <button className="btn-primary">
            {language === 'es' ? 'Actualizar a Premium' : 'Upgrade to Premium'}
          </button>
        </div>
      )}
    </div>
  );
}
