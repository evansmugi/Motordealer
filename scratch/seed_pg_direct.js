const { Client } = require('pg');
const crypto = require('crypto');

async function seed() {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'motordealer'
  });

  await client.connect();
  console.log('Connected to PostgreSQL for direct seeding...');

  const now = new Date().toISOString();

  // 1. CRM Leads
  const leadsRes = await client.query('SELECT count(*) FROM crm_leads');
  if (parseInt(leadsRes.rows[0].count) === 0) {
    console.log('Seeding crm_leads...');
    const initialLeads = [
      {
        name: 'Dr. Mwangi Kiptoo',
        email: 'mwangi.kiptoo@healthgroup.co.ke',
        phone: '+254 722 104 902',
        company: 'Kiptoo Medical Group',
        source: 'Storefront Direct Inquiry',
        current_status: 'Qualified',
        notes: 'Interested in purchasing 2024 Mercedes-Benz S 580 4MATIC for executive transport.',
        conversion_probability: 85,
        intent_score: 92,
        intent_tier: 'HOT',
        buying_timeline: '7-14 Days',
        location_name: 'Nairobi, Kenya',
        device: 'Desktop',
        os: 'Windows'
      },
      {
        name: 'Sarah Jenkins',
        email: 's.jenkins@diplomatic.org',
        phone: '+254 700 882 119',
        company: 'UN Environment Program',
        source: 'Live Chat Concierge',
        current_status: 'Contacted',
        notes: 'Inquired about duty-free diplomatic clearance on 2024 Porsche Cayenne Turbo E-Hybrid.',
        conversion_probability: 70,
        intent_score: 78,
        intent_tier: 'WARM',
        buying_timeline: 'Immediate',
        location_name: 'Gigiri, Nairobi',
        device: 'Mobile',
        os: 'iOS'
      },
      {
        name: 'Hon. Al-Mansoor',
        email: 'almansoor@gulfholdings.ae',
        phone: '+254 711 405 600',
        company: 'Gulf Holdings East Africa',
        source: 'WhatsApp VIP Channel',
        current_status: 'Negotiation',
        notes: 'Requesting custom specs for 2023 Range Rover Autobiography LWB with bespoke interior.',
        conversion_probability: 90,
        intent_score: 96,
        intent_tier: 'HOT',
        buying_timeline: '1-3 Days',
        location_name: 'Karen, Nairobi',
        device: 'Mobile',
        os: 'iOS'
      }
    ];

    for (const l of initialLeads) {
      const docId = crypto.randomBytes(12).toString('hex');
      await client.query(
        `INSERT INTO crm_leads (
          document_id, name, email, phone, company, source, current_status, notes,
          conversion_probability, intent_score, intent_tier, buying_timeline, location_name, device, os,
          created_at, updated_at, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          docId, l.name, l.email, l.phone, l.company, l.source, l.current_status, l.notes,
          l.conversion_probability, l.intent_score, l.intent_tier, l.buying_timeline, l.location_name, l.device, l.os,
          now, now, now
        ]
      );
    }
    console.log('Seeded 3 CRM leads!');
  }

  // 2. Appointments
  const appRes = await client.query('SELECT count(*) FROM appointments');
  if (parseInt(appRes.rows[0].count) === 0) {
    console.log('Seeding appointments...');
    const initialAppointments = [
      {
        client_name: 'Dr. Mwangi Kiptoo',
        client_email: 'mwangi.kiptoo@healthgroup.co.ke',
        client_phone: '+254 722 104 902',
        date: '2026-08-25',
        time: '11:00 AM',
        budget: '25,000,000 KES',
        vehicle_type: 'Mercedes-Benz S 580 4MATIC',
        use_case: 'Executive Driving',
        fuel: 'Petrol / Hybrid',
        current_status: 'Confirmed'
      },
      {
        client_name: 'David Ochieng',
        client_email: 'dochieng@capitalcorp.co.ke',
        client_phone: '+254 733 456 789',
        date: '2026-08-26',
        time: '02:30 PM',
        budget: '28,000,000 KES',
        vehicle_type: 'Porsche Cayenne Turbo E-Hybrid',
        use_case: 'Weekend Luxury SUV',
        fuel: 'Hybrid (PHEV)',
        current_status: 'Scheduled'
      }
    ];

    for (const app of initialAppointments) {
      const docId = crypto.randomBytes(12).toString('hex');
      await client.query(
        `INSERT INTO appointments (
          document_id, client_name, client_email, client_phone, date, time, budget, vehicle_type, use_case, fuel, current_status,
          created_at, updated_at, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          docId, app.client_name, app.client_email, app.client_phone, app.date, app.time, app.budget, app.vehicle_type, app.use_case, app.fuel, app.current_status,
          now, now, now
        ]
      );
    }
    console.log('Seeded 2 appointments!');
  }

  // 3. Trade In Requests
  const tradeRes = await client.query('SELECT count(*) FROM trade_in_requests');
  if (parseInt(tradeRes.rows[0].count) === 0) {
    console.log('Seeding trade_in_requests...');
    const initialTradeIns = [
      {
        client_name: 'Hon. Al-Mansoor',
        client_email: 'almansoor@gulfholdings.ae',
        client_phone: '+254 711 405 600',
        trade_vehicle_make: 'Land Rover',
        trade_vehicle_model: 'Range Rover Vogue V8',
        trade_vehicle_year: '2020',
        trade_vehicle_mileage: '42000',
        trade_vehicle_condition: 'Excellent',
        target_vehicle_name: '2023 Range Rover Autobiography LWB',
        expected_trade_value: '18500000',
        current_status: 'Appraised'
      }
    ];

    for (const t of initialTradeIns) {
      const docId = crypto.randomBytes(12).toString('hex');
      await client.query(
        `INSERT INTO trade_in_requests (
          document_id, client_name, client_email, client_phone, trade_vehicle_make, trade_vehicle_model, trade_vehicle_year, trade_vehicle_mileage,
          trade_vehicle_condition, target_vehicle_name, expected_trade_value, current_status,
          created_at, updated_at, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          docId, t.client_name, t.client_email, t.client_phone, t.trade_vehicle_make, t.trade_vehicle_model, t.trade_vehicle_year, t.trade_vehicle_mileage,
          t.trade_vehicle_condition, t.target_vehicle_name, t.expected_trade_value, t.current_status,
          now, now, now
        ]
      );
    }
    console.log('Seeded 1 trade-in request!');
  }

  // 4. Blogs
  const blogRes = await client.query('SELECT count(*) FROM blogs');
  if (parseInt(blogRes.rows[0].count) === 0) {
    console.log('Seeding blogs...');
    const initialBlogs = [
      {
        title: '2026 East Africa Luxury Import Guide: Duty & Clearance Insights',
        slug: '2026-east-africa-luxury-import-guide',
        author: 'KnK Advisory Board',
        excerpt: 'Everything executive vehicle buyers need to know about KRA valuation bands, duty exemptions, and logbook transfer timelines.',
        content: 'Importing high-end luxury vehicles into Kenya requires navigating specific tax structures...',
        published_date: '2026-08-15',
        read_time: '5 min read',
        tags: JSON.stringify(['Import', 'Luxury Fleet', 'Kenya Duty', 'Logbook'])
      },
      {
        title: 'Hybrid vs Biturbo V8: Choosing the Ultimate Executive Flagship',
        slug: 'hybrid-vs-biturbo-v8-flagship-comparison',
        author: 'Head of Automotive Intelligence',
        excerpt: 'Comparing the Porsche Cayenne E-Hybrid and Mercedes S 580 Biturbo for Nairobi driving dynamics.',
        content: 'As modern automotive technology evolves, luxury buyers face a compelling choice...',
        published_date: '2026-08-18',
        read_time: '7 min read',
        tags: JSON.stringify(['Porsche', 'Mercedes-Benz', 'Hybrid', 'Performance'])
      }
    ];

    for (const b of initialBlogs) {
      const docId = crypto.randomBytes(12).toString('hex');
      await client.query(
        `INSERT INTO blogs (
          document_id, title, slug, author, excerpt, content, published_date, read_time, tags,
          created_at, updated_at, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          docId, b.title, b.slug, b.author, b.excerpt, b.content, b.published_date, b.read_time, b.tags,
          now, now, now
        ]
      );
    }
    console.log('Seeded 2 blogs!');
  }

  await client.end();
  console.log('Seeding complete!');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
