'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::analytics-blacklisted-ip.analytics-blacklisted-ip');
