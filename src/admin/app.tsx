import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Custom Logos & Favicon from public assets
    auth: {
      logo: '/auth-logo.png?v=4',
    },
    menu: {
      logo: '/menu-logo.png?v=4',
    },
    head: {
      favicon: '/favicon.svg',
      title: 'Fuse System | CMS Operational Control',
    },
    // Disable Strapi onboarding tutorial and release notifications
    tutorials: false,
    notifications: {
      releases: false,
    },
    // Custom Admin Translations & Branding Text
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Fuse System',
        'app.components.LeftMenu.navbrand.workplace': 'KnK Automotive ERP & CMS',
        'Auth.form.welcome.title': 'Fuse System Control Center',
        'Auth.form.welcome.subtitle': 'Log in to manage enterprise vehicle fleet & catalog',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log('Fuse System Strapi Admin Engine initialized successfully.');
  },
};
