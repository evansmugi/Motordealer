import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { Navbar } from '../components/layout/Navbar';
import ClientChatWidget from '../components/automotive/ClientChatWidget';
import { TailwindScript } from '../components/layout/TailwindScript';

export const metadata: Metadata = {
  title: 'KnK Automotive Enterprise | Luxury Vehicles & Marketplace',
  description: 'East Africa premier luxury automotive marketplace, bespoke vehicle importation, and executive inventory.',
  openGraph: {
    title: 'KnK Automotive Enterprise',
    description: 'Premier luxury automotive marketplace & bespoke vehicle imports.',
    url: 'http://localhost:3005',
    siteName: 'KnK Automotive',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080808] text-white min-h-screen flex flex-col font-sans antialiased selection:bg-[#c9a84c] selection:text-black">
        <TailwindScript />
        <StoreProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <ClientChatWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
