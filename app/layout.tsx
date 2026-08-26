import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppToaster } from '@/components/satquery/AppToaster';
import { ThemeProvider } from '@/components/satquery/ThemeProvider';

const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'SatQuery AI — Evidence-First Satellite Decision Intelligence',
  description:
    'Ask satellite imagery. Get an answer you can verify. Transform optical, SAR and bi-temporal satellite imagery into evidence-backed, uncertainty-aware decisions.',
  openGraph: {
    title: 'SatQuery AI — Evidence-First Satellite Decision Intelligence',
    description: 'Ask satellite imagery. Get an answer you can verify.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-[#07111F] text-[#F3F7FC]">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
