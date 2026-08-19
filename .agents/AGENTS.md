# Workspace Rules & Guidelines

## Storefront & Admin Synchronization Rule
Every update made to the storefront must be accompanied by its corresponding impact and integration on the admin portal to maintain consistent state, shared data sources, and synchronized updates across both applications.

## Database & API Contract Standards
1. **Vehicle Inventory**: Both Storefront and Admin Portal must read/write to `/api/car-listings` and the `car_listings` table.
2. **Appointments & Test Drives**: Both Storefront and Admin Portal must submit/read test drives via `/api/appointments` and the `crm_appointments` table.
3. **Leads & Inquiries**: Customer leads from all storefront forms must immediately populate the unified `/api/crm-leads` endpoint and `crm_leads` table.
4. **Trade-Ins**: Vehicle trade-in valuations submitted on storefront must map to `/api/trade-in-requests` and the `crm_trade_ins` table.
5. **Site Settings & Branding**: Admin Brand Identity updates must dynamically update the Storefront layout, header, logo, and theme variables via `/api/crm-site-settings` and `crm_site_settings`.
