"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seedData_1 = require("./bootstrap/seedData");
const slaCron_1 = require("./cron/slaCron");
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     */
    register( /* { strapi }: { strapi: Core.Strapi } */) { },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     */
    bootstrap({ strapi }) {
        // Run initial seed data check
        (0, seedData_1.seedInitialData)(strapi).catch(console.error);
        // Run SLA check every 5 minutes
        setInterval(() => {
            (0, slaCron_1.runSlaCheck)(strapi).catch(console.error);
        }, 5 * 60 * 1000);
    },
};
