/**
 * Seed data initializer for KnK Automotive Platform
 */

export async function seedInitialData(strapi: any) {
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
    } catch (permErr: any) {
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

    console.log('[Seed] Initial seed data verification complete.');
  } catch (err) {
    console.error('[Seed] Error populating initial data:', err);
  }
}

export default { seedInitialData };
