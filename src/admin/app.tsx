import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Disable Strapi onboarding tutorial and release notifications
    tutorials: false,
    notifications: {
      releases: false,
    },
    // Custom NEXUS PRIME Theme Customization
    theme: {
      light: {
        colors: {
          primary100: '#E0F2FE',
          primary200: '#BAE6FD',
          primary500: '#3B82F6',
          primary600: '#2563EB',
          primary700: '#1D4ED8',
          buttonPrimary500: '#3B82F6',
          buttonPrimary600: '#2563EB',
        },
      },
      dark: {
        colors: {
          // Dark Cybernetic Background & Surfaces
          neutral0: '#0E1017',        // Main container background
          neutral100: '#151822',      // Sidebar / Panel background
          neutral150: '#1E2330',      // Table header background
          neutral200: '#2A3042',      // Borders & Dividers
          neutral500: '#64748B',      // Secondary text
          neutral600: '#94A3B8',      // Muted text
          neutral700: '#CBD5E1',      // Primary body text
          neutral800: '#F8FAFC',      // Headings & High Contrast Text
          neutral900: '#FFFFFF',

          // Primary Accents (NEXUS Cobalt)
          primary100: 'rgba(59, 130, 246, 0.15)',
          primary200: 'rgba(59, 130, 246, 0.3)',
          primary500: '#3B82F6',
          primary600: '#2563EB',
          primary700: '#1D4ED8',

          // Buttons
          buttonPrimary500: '#3B82F6',
          buttonPrimary600: '#2563EB',
        },
      },
    },
    // Custom Admin Translations & Branding Text
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'NEXUS PRIME',
        'app.components.LeftMenu.navbrand.workplace': 'Bio-Neural & Quantum CMS',
        'Auth.form.welcome.title': 'NEXUS PRIME Control Center',
        'Auth.form.welcome.subtitle': 'Log in to manage bio-hardware telemetry & catalog',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log('NEXUS PRIME Strapi Admin Engine initialized successfully.');
  },
};
