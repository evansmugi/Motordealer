import { seedInitialData } from './bootstrap/seedData';
import { runSlaCheck } from './cron/slaCron';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap({ strapi }: { strapi: any }) {
    // Run initial seed data check
    seedInitialData(strapi).catch(console.error);

    // Run SLA check every 5 minutes
    setInterval(() => {
      runSlaCheck(strapi).catch(console.error);
    }, 5 * 60 * 1000);
  },
};
