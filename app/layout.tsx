import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowYourRightsCard - Instant Legal Guidance',
  description: 'Instant legal guidance in your pocket. Know your constitutional rights during police encounters.',
  keywords: 'legal rights, police encounters, constitutional rights, legal guidance, civil rights',
  authors: [{ name: 'KnowYourRightsCard Team' }],
  openGraph: {
    title: 'KnowYourRightsCard - Instant Legal Guidance',
    description: 'Instant legal guidance in your pocket. Know your constitutional rights during police encounters.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KnowYourRightsCard - Instant Legal Guidance',
    description: 'Instant legal guidance in your pocket. Know your constitutional rights during police encounters.',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
