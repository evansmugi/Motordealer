'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::analytics-blacklisted-ip.analytics-blacklisted-ip');
