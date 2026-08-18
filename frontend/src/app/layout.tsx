import type { Metadata } from 'next';
import { StoreProvider } from '../context/StoreContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/storefront/SearchModal';
import { CartDrawer } from '../components/storefront/CartDrawer';
import { QuickViewModal } from '../components/storefront/QuickViewModal';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'NEXUS PRIME | Futuristic Bio-Neural & Quantum Hardware',
  description: 'Avant-garde digital commerce platform for high-throughput cybernetic telemetry and quantum optics.',
  openGraph: {
    title: 'NEXUS PRIME | Futuristic E-Commerce Platform',
    description: 'Bio-neural and quantum hardware discovery.',
    url: 'http://localhost:3001',
    siteName: 'NEXUS PRIME',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="spatial-grid-bg">
      <body style={{ background: 'var(--nexus-bg)', color: 'var(--nexus-text)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
        <StoreProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <SearchModal />
          <CartDrawer />
          <QuickViewModal />
        </StoreProvider>
      </body>
    </html>
  );
}
