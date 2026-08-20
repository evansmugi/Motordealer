module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/crm-site-settings',
      handler: 'crm-site-setting.getSettings',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/crm-site-settings',
      handler: 'crm-site-setting.updateSettings',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/crm-site-settings',
      handler: 'crm-site-setting.updateSettings',
      config: {
        auth: false,
      },
    },
  ],
};
