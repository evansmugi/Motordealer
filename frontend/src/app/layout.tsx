import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import ClientChatWidget from '../components/automotive/ClientChatWidget';

export const metadata: Metadata = {
  title: 'KnK Automotive Enterprise | Luxury Vehicles & Marketplace',
  description: 'East Africa premier luxury automotive marketplace, bespoke vehicle importation, and executive inventory.',
  openGraph: {
    title: 'KnK Automotive Enterprise',
    description: 'Premier luxury automotive marketplace & bespoke vehicle imports.',
    url: 'http://localhost:3000',
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
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      gold: {
                        50: '#fdfbf7',
                        100: '#f7f2e6',
                        400: '#e5c158',
                        500: '#c9a84c',
                        600: '#ab8b38',
                      }
                    }
                  }
                }
              }
            `
          }}
        />
      </head>
      <body className="bg-[#080808] text-white min-h-screen flex flex-col font-sans antialiased selection:bg-[#c9a84c] selection:text-black">
        <StoreProvider>
          <main className="flex-1">
            {children}
          </main>
          <ClientChatWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
