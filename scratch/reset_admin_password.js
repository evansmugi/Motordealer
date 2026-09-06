const { createStrapi } = require('@strapi/strapi');

async function resetPassword() {
  const app = await createStrapi().load();
  const password = 'Mwangi@6144';
  const hashedPassword = await app.service('admin::user').hashPassword(password);

  const users = await app.db.query('admin::user').findMany();
  console.log('Found Admin Users:', users.map(u => ({ id: u.id, email: u.email })));

  if (!users || users.length === 0) {
    const superAdminRole = await app.db.query('admin::role').findOne({ where: { code: 'strapi-super-admin' } });
    const newUser = await app.service('admin::user').create({
      email: 'systemadmin@fuse-erp.co.ke',
      firstname: 'System',
      lastname: 'Admin',
      password: hashedPassword,
      isActive: true,
      roles: superAdminRole ? [superAdminRole.id] : []
    });
    console.log('Created Super Admin user systemadmin@fuse-erp.co.ke with password:', password);
  } else {
    for (const user of users) {
      await app.db.query('admin::user').update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          isActive: true
        }
      });
      console.log(`Updated password for admin user "${user.email}" to: ${password}`);
    }
  }

  process.exit(0);
}

resetPassword().catch(err => {
  console.error('Error resetting password:', err);
  process.exit(1);
});
