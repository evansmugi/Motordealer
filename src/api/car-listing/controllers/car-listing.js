'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::car-listing.car-listing', ({ strapi }) => ({
  async find(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::car-listing.car-listing');
      return { data: entries };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const entry = await strapi.entityService.findOne('api::car-listing.car-listing', id);
      return { data: entry };
    } catch (err) {
      return ctx.notFound('Car listing not found');
    }
  }
}));
