"use strict";
/**
 * Seed data initializer for KnK Automotive Platform
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = seedInitialData;
async function seedInitialData(strapi) {
    try {
        // 0. Enable Public Permissions for APIs
        try {
            const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
                where: { type: 'public' }
            });
            if (publicRole) {
                const actionsToEnable = [
                    'api::car-listing.car-listing.find',
                    'api::car-listing.car-listing.findOne',
                    'api::car-listing.car-listing.create',
                    'api::car-listing.car-listing.update',
                    'api::car-listing.car-listing.delete',
                    'api::accessory.accessory.find',
                    'api::accessory.accessory.findOne',
                    'api::blog.blog.find',
                    'api::blog.blog.findOne',
                    'api::appointment.appointment.create',
                    'api::trade-in-request.trade-in-request.create',
                    'api::crm-lead.crm-lead.create',
                    'api::crm-support-thread.crm-support-thread.create',
                    'api::crm-support-message.crm-support-message.create'
                ];
                for (const action of actionsToEnable) {
                    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action, role: publicRole.id }
                    });
                    if (!existing) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action, role: publicRole.id }
                        });
                    }
                }
            }
        }
        catch (permErr) {
            console.log('[Seed] Permissions check:', permErr.message);
        }
        // 1. Car Listings
        const cars = await strapi.entityService.findMany('api::car-listing.car-listing');
        if (!cars || cars.length === 0) {
            console.log('[Seed] Populating initial Car Listings...');
            const initialCars = [
                {
                    listing_title: '2024 Mercedes-Benz S 580 4MATIC',
                    tagline: 'V8 Biturbo, Executive Rear Package, 3D Burmester Audio',
                    price: '24500000',
                    make: 'Mercedes-Benz',
                    model: 'S 580 4MATIC',
                    condition: 'Foreign Used',
                    year: '2024',
                    transmission: 'Automatic',
                    engine: '4.0L V8 Biturbo with EQ Boost',
                    fuel_type: 'Petrol / Gasoline',
                    mileage: '8400',
                    color: 'Obsidian Black Metallic',
                    interior_color: 'Nappa Leather Black',
                    offer_type: 'Featured',
                    listing_description: 'Flagship luxury sedan with full option specification. Rear legroom executive seating and panoramic sunroof.',
                    images: [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' }],
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                },
                {
                    listing_title: '2024 Porsche Cayenne Turbo E-Hybrid',
                    tagline: '729 HP V8 Plug-In Hybrid, Sports Chrono, Air Suspension',
                    price: '28000000',
                    make: 'Porsche',
                    model: 'Cayenne Turbo E-Hybrid',
                    condition: 'Brand New',
                    year: '2024',
                    transmission: 'Automatic',
                    engine: '4.0L V8 Turbo PHEV (729 HP)',
                    fuel_type: 'Hybrid (PHEV)',
                    mileage: '3200',
                    color: 'Arctic Grey',
                    interior_color: 'Black / Bordeaux Red Leather',
                    offer_type: 'Featured',
                    listing_description: 'Ultimate performance SUV combining twin-turbo V8 power with electric drive efficiency.',
                    images: [{ url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop' }],
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                },
                {
                    listing_title: '2023 Range Rover Autobiography LWB',
                    tagline: 'Executive Class Seating, SV Bespoke Leather, 4.4L V8',
                    price: '32500000',
                    make: 'Land Rover',
                    model: 'Range Rover Autobiography',
                    condition: 'Foreign Used',
                    year: '2023',
                    transmission: 'Automatic',
                    engine: '4.4L Twin-Turbo V8 (523 HP)',
                    fuel_type: 'Petrol / Gasoline',
                    mileage: '12000',
                    color: 'Batumi Gold',
                    interior_color: 'Perlino Executive Leather',
                    offer_type: 'Featured',
                    listing_description: 'Peerless luxury SUV with long wheelbase, executive rear lounge seating, and Meridian Signature Sound.',
                    images: [{ url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop' }],
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                },
                {
                    listing_title: '2024 BMW M8 Competition Gran Coupe',
                    tagline: '617 HP V8 Twin-Turbo, M xDrive, Carbon Package',
                    price: '26000000',
                    make: 'BMW',
                    model: 'M8 Competition',
                    condition: 'Brand New',
                    year: '2024',
                    transmission: 'Automatic',
                    engine: '4.4L Twin-Power V8 (617 HP)',
                    fuel_type: 'Petrol / Gasoline',
                    mileage: '1500',
                    color: 'Isle of Man Green',
                    interior_color: 'Merino Midrand Beige',
                    offer_type: 'Special',
                    listing_description: 'High-performance 4-door luxury coupe delivering supercar acceleration with daily luxury.',
                    images: [{ url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop' }],
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                },
                {
                    listing_title: '2024 Audi RS6 Avant Performance',
                    tagline: '621 HP V8 Super Wagon, Ceramic Brakes, Bang & Olufsen 3D',
                    price: '22500000',
                    make: 'Audi',
                    model: 'RS6 Avant Performance',
                    condition: 'Foreign Used',
                    year: '2024',
                    transmission: 'Automatic',
                    engine: '4.0L TFSI Twin-Turbo V8',
                    fuel_type: 'Petrol / Gasoline',
                    mileage: '5400',
                    color: 'Nardo Grey',
                    interior_color: 'Valcona Leather Cognac',
                    offer_type: 'Special',
                    listing_description: 'Iconic high-performance wagon with dynamic all-wheel steering and RS sport suspension.',
                    images: [{ url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop' }],
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                },
                {
                    listing_title: '2024 Toyota Land Cruiser 300 ZX VIP',
                    tagline: '3.5L Twin-Turbo V6, Modellista Kit, Rear Entertainment',
                    price: '19800000',
                    make: 'Toyota',
                    model: 'Land Cruiser 300 ZX',
                    condition: 'Brand New',
                    year: '2024',
                    transmission: 'Automatic',
                    engine: '3.5L Twin-Turbo V6 (409 HP)',
                    fuel_type: 'Petrol / Gasoline',
                    mileage: '0',
                    color: 'Precious White Pearl',
                    interior_color: 'Neutral Beige Leather',
                    offer_type: 'Featured',
                    listing_description: 'Flagship off-road luxury SUV with E-KDSS suspension and JBL 14-speaker sound.',
                    images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop' }],
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                }
            ];
            for (const car of initialCars) {
                await strapi.entityService.create('api::car-listing.car-listing', { data: car });
            }
        }
        // 2. Accessories
        const acc = await strapi.entityService.findMany('api::accessory.accessory');
        if (!acc || acc.length === 0) {
            console.log('[Seed] Populating initial Accessories...');
            await strapi.entityService.create('api::accessory.accessory', {
                data: {
                    name: 'AMG 22-Inch Monoblock Forged Wheel Set',
                    category: 'Wheels & Rims',
                    price: '850000',
                    description: 'Genuine AMG forged alloy wheels for S-Class and G-Wagon.',
                    in_stock: true,
                    publishedAt: new Date().toISOString()
                }
            });
        }
        // 3. Lead Sources
        const sources = await strapi.entityService.findMany('api::crm-lead-source.crm-lead-source');
        if (!sources || sources.length === 0) {
            console.log('[Seed] Populating initial Lead Sources...');
            const initialSources = [
                { name: 'Storefront Direct Inquiry', category: 'Digital Marketplace', is_active: true },
                { name: 'Live Chat Concierge', category: 'Digital Chat', is_active: true },
                { name: 'WhatsApp VIP Channel', category: 'Social / Mobile', is_active: true },
                { name: 'Google Search Ads', category: 'Paid Performance', is_active: true },
                { name: 'Instagram & TikTok Luxury Showcase', category: 'Social Ads', is_active: true }
            ];
            for (const s of initialSources) {
                await strapi.entityService.create('api::crm-lead-source.crm-lead-source', { data: { ...s, publishedAt: new Date().toISOString() } });
            }
        }
        // 4. Scoring Rules
        const rules = await strapi.entityService.findMany('api::crm-scoring-rule.crm-scoring-rule');
        if (!rules || rules.length === 0) {
            console.log('[Seed] Populating Scoring Rules...');
            const initialRules = [
                { rule_name: 'Booked Test Drive Viewing', trigger_event: 'test_drive_requested', score_impact: 30, is_active: true },
                { rule_name: 'Calculated Trade-In Valuation', trigger_event: 'trade_in_calculated', score_impact: 15, is_active: true },
                { rule_name: 'Opened Price Inquiry Modal', trigger_event: 'inquiry_modal_opened', score_impact: 10, is_active: true },
                { rule_name: 'Repeat Visitor (3+ Sessions)', trigger_event: 'return_visits', score_impact: 15, is_active: true }
            ];
            for (const r of initialRules) {
                await strapi.entityService.create('api::crm-scoring-rule.crm-scoring-rule', { data: { ...r, publishedAt: new Date().toISOString() } });
            }
        }
        // 5. CRM Leads
        const leads = await strapi.entityService.findMany('api::crm-lead.crm-lead');
        if (!leads || leads.length === 0) {
            console.log('[Seed] Populating initial CRM Leads...');
            const initialLeads = [
                {
                    name: 'Dr. Mwangi Kiptoo',
                    email: 'mwangi.kiptoo@healthgroup.co.ke',
                    phone: '+254 722 104 902',
                    company: 'Kiptoo Medical Group',
                    source: 'Storefront Direct Inquiry',
                    current_status: 'Qualified',
                    notes: 'Interested in purchasing 2024 Mercedes-Benz S 580 4MATIC for executive chauffeur transport.',
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
                await strapi.entityService.create('api::crm-lead.crm-lead', { data: { ...l, publishedAt: new Date().toISOString() } });
            }
        }
        // 6. Appointments & Test Drives
        const appointments = await strapi.entityService.findMany('api::appointment.appointment');
        if (!appointments || appointments.length === 0) {
            console.log('[Seed] Populating initial Showroom Appointments...');
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
                await strapi.entityService.create('api::appointment.appointment', { data: { ...app, publishedAt: new Date().toISOString() } });
            }
        }
        // 7. Trade-In Requests
        const tradeIns = await strapi.entityService.findMany('api::trade-in-request.trade-in-request');
        if (!tradeIns || tradeIns.length === 0) {
            console.log('[Seed] Populating initial Trade-In Requests...');
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
                    offered_valuation: '18000000',
                    currentStatus: 'Valued'
                }
            ];
            for (const t of initialTradeIns) {
                await strapi.entityService.create('api::trade-in-request.trade-in-request', { data: { ...t, publishedAt: new Date().toISOString() } });
            }
        }
        // 8. Blogs & News Guides
        const blogs = await strapi.entityService.findMany('api::blog.blog');
        if (!blogs || blogs.length === 0) {
            console.log('[Seed] Populating initial Luxury Blogs...');
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
                await strapi.entityService.create('api::blog.blog', { data: { ...b, publishedAt: new Date().toISOString() } });
            }
        }
        console.log('[Seed] Initial seed data verification complete.');
    }
    catch (err) {
        console.error('[Seed] Error populating initial data:', err);
    }
}
exports.default = { seedInitialData };
