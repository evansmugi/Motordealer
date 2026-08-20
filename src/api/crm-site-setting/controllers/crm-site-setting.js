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
  },

  async uploadLogo(ctx) {
    try {
      const fs = require('fs');
      const path = require('path');

      const body = ctx.request.body || {};
      let fileName = body.fileName || 'knk-logo-horizontal.png';
      let fileData = body.fileData;

      const ext = path.extname(fileName) || '.png';
      const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '-');
      const cleanFileName = `${baseName}${ext}`;

      if (fileData) {
        const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const appRoot = strapi.dirs?.app?.root || process.cwd();

        // Save to frontend/public/images/
        const frontendDir = path.resolve(appRoot, 'frontend/public/images');
        if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
        fs.writeFileSync(path.join(frontendDir, cleanFileName), buffer);

        // Save to dashboard/public/images/
        const dashboardDir = path.resolve(appRoot, 'dashboard/public/images');
        if (!fs.existsSync(dashboardDir)) fs.mkdirSync(dashboardDir, { recursive: true });
        fs.writeFileSync(path.join(dashboardDir, cleanFileName), buffer);
      }

      const relativeUrl = `/images/${cleanFileName}`;
      return { ok: true, url: relativeUrl, fileName: cleanFileName };
    } catch (e) {
      console.error('Failed to upload logo:', e);
      return ctx.badRequest('Failed to save logo file: ' + e.message);
    }
  }
}));
