"use strict";
/**
 * Seed data initializer for KnK Automotive Platform
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = seedInitialData;
async function seedInitialData(strapi) {
    try {
        // 1. Car Listings
        const cars = await strapi.entityService.findMany('api::car-listing.car-listing');
        if (!cars || cars.length === 0) {
            console.log('[Seed] Populating initial Car Listings...');
            const initialCars = [
                {
                    listing_title: '2024 Mercedes-Benz S 580 4MATIC Luxury Sedan',
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
                    youtube_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    currentStatus: 'Available',
                    publishedAt: new Date().toISOString()
                },
                {
                    listing_title: '2024 Porsche Cayenne Turbo E-Hybrid',
                    price: '28000000',
                    make: 'Porsche',
                    model: 'Cayenne Turbo E-Hybrid',
                    condition: 'Brand New',
                    year: '2024',
                    transmission: 'Automatic',
                    engine: '4.0L V8 Turbo PHEV (729 HP)',
                    fuel_type: 'Hybrid (PHEV)',
                    mileage: '0',
                    color: 'Arctic Grey',
                    interior_color: 'Black / Bordeaux Red Leather',
                    offer_type: 'Featured',
                    listing_description: 'Ultimate performance SUV combining twin-turbo V8 power with electric drive efficiency.',
                    youtube_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
    }
    catch (err) {
        console.error('[Seed] Error populating initial data:', err);
    }
}
exports.default = { seedInitialData };
