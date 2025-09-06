import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowYourRightsCard - Instant Legal Guidance',
  description:
    'Mobile-first app providing instant, understandable legal guidance and documentation tools for citizens encountering law enforcement.',
  keywords:
    'legal rights, police encounters, constitutional rights, legal guidance, citizen rights',
  authors: [{ name: 'KnowYourRightsCard Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
