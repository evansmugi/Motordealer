import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Custom Logos & Favicon from public assets
    auth: {
      logo: '/auth-logo.svg',
    },
    menu: {
      logo: '/menu-logo.svg',
    },
    head: {
      favicon: '/favicon.svg',
      title: 'NEXUS PRIME | CMS Operational Control',
    },
    // Disable Strapi onboarding tutorial and release notifications
    tutorials: false,
    notifications: {
      releases: false,
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
