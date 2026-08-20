'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

let memorySettingsCache = {};

module.exports = createCoreController('api::crm-site-setting.crm-site-setting', ({ strapi }) => ({
  async getSettings(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::crm-site-setting.crm-site-setting');
      const settingsObj = { ...memorySettingsCache };
      if (entries && Array.isArray(entries)) {
        entries.forEach(item => {
          if (item.key) settingsObj[item.key] = item.value;
        });
      }
      ['storefrontHeaderLogoUrl', 'adminSidebarLogoUrl', 'adminTopNavLogoUrl', 'logoUrl'].forEach(key => {
        if (!settingsObj[key] || (typeof settingsObj[key] === 'string' && settingsObj[key].length > 1000 && settingsObj[key].startsWith('data:image'))) {
          settingsObj[key] = '/images/knk-logo-horizontal.png';
        }
      });
      return { data: settingsObj };
    } catch (e) {
      return { data: memorySettingsCache };
    }
  },

  async updateSettings(ctx) {
    const payload = ctx.request.body.data || ctx.request.body || {};
    memorySettingsCache = { ...memorySettingsCache, ...payload };

    try {
      for (const [key, value] of Object.entries(payload)) {
        const existing = await strapi.entityService.findMany('api::crm-site-setting.crm-site-setting', {
          filters: { key }
        });
        if (existing && existing.length > 0) {
          await strapi.entityService.update('api::crm-site-setting.crm-site-setting', existing[0].id, {
            data: { value }
          });
        } else {
          await strapi.entityService.create('api::crm-site-setting.crm-site-setting', {
            data: { key, value }
          });
        }
      }
    } catch (e) {
      console.error('Failed to update Strapi crm_site_settings:', e);
    }

    return { data: memorySettingsCache };
  }
}));
