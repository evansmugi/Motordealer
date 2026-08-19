'use strict';
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::analytics-funnel.analytics-funnel');
