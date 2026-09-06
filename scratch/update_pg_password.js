const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'motordealer'
  });

  await client.connect();
  console.log('Connected to PostgreSQL motordealer database!');

  const password = 'Mwangi@6144';
  const hash = bcrypt.hashSync(password, 10);

  const res = await client.query('SELECT id, email FROM admin_users');
  console.log('Existing Admin Users:', res.rows);

  for (const user of res.rows) {
    await client.query('UPDATE admin_users SET password = $1, is_active = true, blocked = false WHERE id = $2', [hash, user.id]);
    console.log(`Updated PostgreSQL password for user "${user.email}" to: ${password}`);
  }

  await client.end();
}

updatePassword().catch(err => {
  console.error('PostgreSQL update error:', err);
  process.exit(1);
});
