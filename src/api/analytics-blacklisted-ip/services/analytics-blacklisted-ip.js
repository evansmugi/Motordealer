'use strict';
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::analytics-blacklisted-ip.analytics-blacklisted-ip');
