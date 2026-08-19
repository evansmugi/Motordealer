import { create } from 'zustand'
import { api } from '../lib/apiClient'
import { supabase } from '../lib/superbaseClient'
import { sortChatMessages } from '../utils/chatUtils'

const initialLeads = [
  { id: 'lead-1', name: 'James Mwangi', email: 'j.mwangi@apexlogistics.co.ke', phone: '+254712345678', company: 'Apex Logistics Ltd', source: 'Direct Search', status: 'new', campaign_id: 'camp-1', assigned_to: 'Alex Kimani', notes: 'Interested in fleet of 3 Land Cruiser V8s', conversion_probability: 85, intent_score: 85, intent_tier: 'HIGH', buying_timeline: '< 30 days', behavioral_metrics: { vehicle_views: 6, returns_7d: true, similar_time_min: 8.5, forms_submitted: 2, videos_watched: 2, max_video_pct: 85, appointment_booked: true, whatsapp_clicks: 4, blogs_viewed: 3, photos_downloaded: 2, tradein_uploaded: true }, created_at: '2026-07-28' },
  { id: 'lead-2', name: 'Sarah Cherono', email: 's.cherono@safariholding.com', phone: '+254723456789', company: 'Safari Holding Ltd', source: 'Google SEM', status: 'contacted', campaign_id: 'camp-2', assigned_to: 'Sarah Jenkins', notes: 'Looking for luxury SUV leasing options', conversion_probability: 60, intent_score: 60, intent_tier: 'MEDIUM', buying_timeline: '1-3 months', behavioral_metrics: { vehicle_views: 3, returns_7d: true, similar_time_min: 4.0, forms_submitted: 1, videos_watched: 1, max_video_pct: 50, appointment_booked: false, whatsapp_clicks: 2, blogs_viewed: 1, photos_downloaded: 1, tradein_uploaded: false }, created_at: '2026-07-29' },
  { id: 'lead-3', name: 'Dr. David Ochieng', email: 'd.ochieng@nairobihospital.org', phone: '+254734567890', company: 'Nairobi Medical Group', source: 'Referral', status: 'qualified', campaign_id: 'camp-1', assigned_to: 'Alex Kimani', notes: 'Requires Mercedes-Benz GLE 400d for executive fleet', conversion_probability: 90, intent_score: 90, intent_tier: 'HIGH', buying_timeline: '< 30 days', behavioral_metrics: { vehicle_views: 8, returns_7d: true, similar_time_min: 12.0, forms_submitted: 2, videos_watched: 3, max_video_pct: 100, appointment_booked: true, whatsapp_clicks: 5, blogs_viewed: 4, photos_downloaded: 4, tradein_uploaded: true }, created_at: '2026-07-30' },
  { id: 'lead-4', name: 'Aminah Hassan', email: 'aminah@coasttours.co.ke', phone: '+254745678901', company: 'Coastline Tours', source: 'Trade Show', status: 'new', campaign_id: 'camp-3', assigned_to: 'Michael Chen', notes: 'Safari tour 4x4 vehicles custom build', conversion_probability: 50, intent_score: 50, intent_tier: 'MEDIUM', buying_timeline: '1-3 months', behavioral_metrics: { vehicle_views: 2, returns_7d: false, similar_time_min: 3.2, forms_submitted: 1, videos_watched: 1, max_video_pct: 30, appointment_booked: false, whatsapp_clicks: 1, blogs_viewed: 0, photos_downloaded: 0, tradein_uploaded: false }, created_at: '2026-08-01' },
  { id: 'lead-5', name: 'Peter Karanja', email: 'peter@karanjagroup.co.ke', phone: '+254756789012', company: 'Karanja Group', source: 'ABM Campaign', status: 'won', campaign_id: 'camp-4', assigned_to: 'Sarah Jenkins', notes: 'Purchased 2 BMW X5 M Sport units', conversion_probability: 100, intent_score: 100, intent_tier: 'HIGH', buying_timeline: '< 30 days', behavioral_metrics: { vehicle_views: 12, returns_7d: true, similar_time_min: 22.0, forms_submitted: 3, videos_watched: 4, max_video_pct: 100, appointment_booked: true, whatsapp_clicks: 8, blogs_viewed: 5, photos_downloaded: 6, tradein_uploaded: true }, created_at: '2026-07-15' },
  { id: 'lead-6', name: 'Grace Mutua', email: 'g.mutua@equatorcorp.com', phone: '+254767890123', company: 'Equator Energy', source: 'Organic Search', status: 'converted', campaign_id: 'camp-2', assigned_to: 'Alex Kimani', notes: 'Converted to long-term corporate customer', conversion_probability: 100, intent_score: 100, intent_tier: 'HIGH', buying_timeline: '< 30 days', behavioral_metrics: { vehicle_views: 10, returns_7d: true, similar_time_min: 15.0, forms_submitted: 2, videos_watched: 3, max_video_pct: 95, appointment_booked: true, whatsapp_clicks: 6, blogs_viewed: 3, photos_downloaded: 3, tradein_uploaded: true }, created_at: '2026-07-10' },
  { id: 'lead-7', name: 'John Kiprop', email: 'jkiprop@riftminers.com', phone: '+254778901234', company: 'Rift Valley Mining', source: 'Referral', status: 'archived', campaign_id: 'camp-3', assigned_to: 'Michael Chen', notes: 'Budget deferred to next fiscal year', conversion_probability: 20, intent_score: 20, intent_tier: 'LOW', buying_timeline: '3+ months', behavioral_metrics: { vehicle_views: 1, returns_7d: false, similar_time_min: 1.0, forms_submitted: 1, videos_watched: 0, max_video_pct: 0, appointment_booked: false, whatsapp_clicks: 0, blogs_viewed: 0, photos_downloaded: 0, tradein_uploaded: false }, created_at: '2026-06-20' },
  { id: 'lead-8', name: 'Catherine Nderitu', email: 'catherine@highlandtea.co.ke', phone: '+254789012345', company: 'Highland Tea Exporters', source: 'Direct Search', status: 'contacted', campaign_id: 'camp-1', assigned_to: 'Alex Kimani', notes: 'Executive sedan enquiry', conversion_probability: 65, intent_score: 65, intent_tier: 'MEDIUM', buying_timeline: '1-3 months', behavioral_metrics: { vehicle_views: 4, returns_7d: true, similar_time_min: 5.5, forms_submitted: 1, videos_watched: 2, max_video_pct: 60, appointment_booked: false, whatsapp_clicks: 3, blogs_viewed: 2, photos_downloaded: 1, tradein_uploaded: false }, created_at: '2026-08-02' },
  { id: 'lead-9', name: 'Brian Wanjala', email: 'brian@urbantech.io', phone: '+254790123456', company: 'UrbanTech Kenya', source: 'Paid Social', status: 'new', campaign_id: 'camp-5', assigned_to: 'Sarah Jenkins', notes: 'Tesla Model Y import query', conversion_probability: 40, intent_score: 40, intent_tier: 'LOW', buying_timeline: '3+ months', behavioral_metrics: { vehicle_views: 2, returns_7d: false, similar_time_min: 2.0, forms_submitted: 1, videos_watched: 1, max_video_pct: 25, appointment_booked: false, whatsapp_clicks: 1, blogs_viewed: 0, photos_downloaded: 0, tradein_uploaded: false }, created_at: '2026-08-03' },
  { id: 'lead-10', name: 'Fatima Abdi', email: 'f.abdi@somaliatracing.com', phone: '+254701234567', company: 'Somalia Trading Ltd', source: 'Trade Show', status: 'qualified', campaign_id: 'camp-3', assigned_to: 'Michael Chen', notes: 'Toyota Prado TX-L fleet requirement', conversion_probability: 80, intent_score: 80, intent_tier: 'HIGH', buying_timeline: '< 30 days', behavioral_metrics: { vehicle_views: 7, returns_7d: true, similar_time_min: 10.0, forms_submitted: 2, videos_watched: 2, max_video_pct: 80, appointment_booked: true, whatsapp_clicks: 4, blogs_viewed: 2, photos_downloaded: 3, tradein_uploaded: true }, created_at: '2026-08-03' }
]

function deduplicateLeads(leadsArray) {
  if (!Array.isArray(leadsArray)) return []
  const result = []

  for (const lead of leadsArray) {
    if (!lead || !lead.name) continue

    const rawPhone = lead.phone ? lead.phone.replace(/\D/g, '') : ''
    const rawEmail = (lead.email && !lead.email.endsWith('@chatlead.knk') && lead.email !== 'N/A') ? lead.email.toLowerCase().trim() : ''
    const cleanName = lead.name.replace(/\s*\(.*\)$/, '').trim().toLowerCase()

    const existingIndex = result.findIndex(existing => {
      // 1. Direct ID match
      if (lead.id && existing.id && lead.id === existing.id) return true

      const exPhone = existing.phone ? existing.phone.replace(/\D/g, '') : ''
      const exEmail = (existing.email && !existing.email.endsWith('@chatlead.knk') && existing.email !== 'N/A') ? existing.email.toLowerCase().trim() : ''
      const exName = existing.name ? existing.name.replace(/\s*\(.*\)$/, '').trim().toLowerCase() : ''

      // 2. Phone match
      if (rawPhone && exPhone && rawPhone.length >= 6 && exPhone.length >= 6 && rawPhone === exPhone) {
        return true
      }

      // 3. Real email match
      if (rawEmail && exEmail && rawEmail === exEmail) {
        return true
      }

      // 4. Exact name match (excluding generic placeholders)
      if (cleanName && exName && cleanName.length >= 3 && cleanName === exName && 
          cleanName !== 'website visitor' && cleanName !== 'chat visitor' && cleanName !== 'live support visitor') {
        return true
      }

      return false
    })

    if (existingIndex < 0) {
      result.push(lead)
    } else {
      const existing = result[existingIndex]
      const bestPhone = (existing.phone && existing.phone.trim()) ? existing.phone : lead.phone
      const bestEmail = (existing.email && !existing.email.endsWith('@chatlead.knk') && existing.email !== 'N/A')
        ? existing.email
        : ((lead.email && !lead.email.endsWith('@chatlead.knk') && lead.email !== 'N/A') ? lead.email : existing.email || lead.email)
      const bestSource = (existing.source && !existing.source.includes('Live Support')) ? existing.source : (lead.source || existing.source)
      const bestStatus = (existing.status === 'qualified' || existing.status === 'won') ? existing.status : (lead.status || existing.status)
      const bestNotes = existing.notes && lead.notes
        ? (existing.notes.includes(lead.notes) ? existing.notes : `${existing.notes}\n${lead.notes}`)
        : (existing.notes || lead.notes)

      result[existingIndex] = {
        ...existing,
        ...lead,
        id: existing.id,
        name: (existing.name && existing.name !== 'Website Visitor' && existing.name !== 'Chat Visitor') ? existing.name : lead.name,
        phone: bestPhone,
        email: bestEmail,
        company: (existing.company && existing.company !== '—' && existing.company !== 'Live Support Visitor') ? existing.company : lead.company,
        source: bestSource,
        status: bestStatus,
        notes: bestNotes,
        behavioral_metrics: {
          ...(existing.behavioral_metrics || {}),
          ...(lead.behavioral_metrics || {})
        },
        ip_address: existing.ip_address || lead.ip_address,
        latitude: existing.latitude || lead.latitude,
        longitude: existing.longitude || lead.longitude,
        location_name: existing.location_name || lead.location_name,
        browser: existing.browser || lead.browser,
        device: existing.device || lead.device,
        os: existing.os || lead.os
      }
    }
  }

  return result
}

const initialVehicleInventory = [
  { id: 'veh-101', name: 'Toyota Land Cruiser V8 ZX (2024)', category: 'Executive SUV', price: 22500000, stock: 4 },
  { id: 'veh-102', name: 'Mercedes-Benz GLE 400d AMG Line (2023)', category: 'Luxury SUV', price: 18800000, stock: 3 },
  { id: 'veh-103', name: 'Toyota Land Cruiser Prado TX-L (2024)', category: '4x4 Offroad', price: 14200000, stock: 8 },
  { id: 'veh-104', name: 'BMW X7 xDrive40i M Sport (2024)', category: 'Luxury SUV', price: 24500000, stock: 2 },
  { id: 'veh-105', name: 'Range Rover Vogue Autobiography (2023)', category: 'Ultra Luxury SUV', price: 32000000, stock: 1 },
  { id: 'veh-106', name: 'Mercedes-Benz E200 AMG Line (2023)', category: 'Executive Sedan', price: 9800000, stock: 5 },
  { id: 'veh-107', name: 'Isuzu D-Max Double Cab 4x4 (2024)', category: 'Commercial Pickup', price: 6800000, stock: 12 },
  { id: 'veh-108', name: 'Porsche Cayenne Coupe (2024)', category: 'Performance SUV', price: 26000000, stock: 2 },
  { id: 'veh-109', name: 'Lexus LX600 Ultra Luxury (2024)', category: 'Executive SUV', price: 34500000, stock: 2 },
  { id: 'veh-110', name: 'Tesla Model Y Long Range (2024)', category: 'Electric Vehicle', price: 9500000, stock: 3 },
]

const initialOpportunities = [
  { id: 'opp-1', lead_id: 'lead-1', vehicle_id: 'veh-101', vehicle_name: 'Toyota Land Cruiser V8 ZX (2024)', name: 'Apex Logistics Fleet Deal', expected_value: 24500000, close_date: '2026-08-25', probability: 75, stage: 'viewing', campaign_id: 'camp-1', notes: '3x Toyota Land Cruiser V8 2024 models', updated_at: '2026-08-03', created_at: '2026-07-28' },
  { id: 'opp-2', lead_id: 'lead-2', vehicle_id: 'veh-105', vehicle_name: 'Range Rover Vogue Autobiography (2023)', name: 'Safari Holding Executive Lease', expected_value: 8200000, close_date: '2026-09-10', probability: 60, stage: 'qualified', campaign_id: 'camp-2', notes: 'Range Rover Velar 3-year lease contract', updated_at: '2026-08-02', created_at: '2026-07-29' },
  { id: 'opp-3', lead_id: 'lead-3', vehicle_id: 'veh-102', vehicle_name: 'Mercedes-Benz GLE 400d AMG Line (2023)', name: 'Nairobi Hospital GLE Fleet', expected_value: 14800000, close_date: '2026-08-18', probability: 85, stage: 'deposit', campaign_id: 'camp-1', notes: 'Finalizing trade-in residual valuation', updated_at: '2026-08-04', created_at: '2026-07-30' },
  { id: 'opp-4', lead_id: 'lead-4', vehicle_id: 'veh-103', vehicle_name: 'Toyota Land Cruiser Prado TX-L (2024)', name: 'Coastline Tours 4x4 Safari Fleet', expected_value: 18500000, close_date: '2026-09-30', probability: 50, stage: 'onboarding', campaign_id: 'camp-3', notes: 'Custom pop-up roof specs under review', updated_at: '2026-08-01', created_at: '2026-08-01' },
  { id: 'opp-5', lead_id: 'lead-5', vehicle_id: 'veh-104', vehicle_name: 'BMW X7 xDrive40i M Sport (2024)', name: 'Karanja Group BMW Dual Purchase', expected_value: 19600000, close_date: '2026-07-28', probability: 100, stage: 'won', won_substage: 'invoiced', campaign_id: 'camp-4', notes: 'Delivered and paid in full', updated_at: '2026-07-28', created_at: '2026-07-15' },
  { id: 'opp-6', lead_id: 'lead-8', vehicle_id: 'veh-106', vehicle_name: 'Mercedes-Benz E200 AMG Line (2023)', name: 'Highland Tea Executive Sedan', expected_value: 7400000, close_date: '2026-08-28', probability: 65, stage: 'viewing', campaign_id: 'camp-1', notes: 'Mercedes-Benz E200 2023 option', updated_at: '2026-08-03', created_at: '2026-08-02' },
  { id: 'opp-7', lead_id: 'lead-10', vehicle_id: 'veh-103', vehicle_name: 'Toyota Land Cruiser Prado TX-L (2024)', name: 'Somalia Trading Prado TX Fleet', expected_value: 16200000, close_date: '2026-08-22', probability: 80, stage: 'deposit', campaign_id: 'camp-3', notes: 'Duty exempt verification pending', updated_at: '2026-08-03', created_at: '2026-08-03' },
  { id: 'opp-8', lead_id: 'lead-7', vehicle_id: 'veh-107', vehicle_name: 'Isuzu D-Max Double Cab 4x4 (2024)', name: 'Rift Mining Heavy Duty Pickups', expected_value: 11000000, close_date: '2026-07-10', probability: 0, stage: 'lost', campaign_id: 'camp-3', notes: 'Lost due to budget freeze', updated_at: '2026-07-10', created_at: '2026-06-20' },
  { id: 'opp-9', lead_id: 'lead-9', vehicle_id: 'veh-110', vehicle_name: 'Tesla Model Y Long Range (2024)', name: 'UrbanTech Electric Vehicle Discovery', expected_value: 9500000, close_date: '2026-09-15', probability: 35, stage: 'new_lead', campaign_id: 'camp-5', notes: 'Tesla import inquiry', updated_at: '2026-08-03', created_at: '2026-08-03' },
  { id: 'opp-10', lead_id: 'lead-6', vehicle_id: 'veh-109', vehicle_name: 'Lexus LX600 Ultra Luxury (2024)', name: 'Equator Energy Executive LX600', expected_value: 34500000, close_date: '2026-07-20', probability: 100, stage: 'won', won_substage: 'delivered', campaign_id: 'camp-2', notes: 'Corporate purchase completed', updated_at: '2026-07-20', created_at: '2026-07-10' }
]

const initialCampaigns = [
  { id: 'camp-1', name: 'Q3 Enterprise Luxury Fleet Blast', slug: 'q3-enterprise-luxury-fleet-blast', type: 'Email Campaign', budget: 450000, start_date: '2026-07-01', end_date: '2026-09-30', status: 'Active', description: 'Targeting C-level executives for fleet upgrades', leads_count: 42, won_count: 5, total_revenue: 68500000, conversion_rate: 11.9 },
  { id: 'camp-2', name: 'Google SEM Executive SUVs', slug: 'google-sem-executive-suvs', type: 'Paid Search', budget: 300000, start_date: '2026-07-15', end_date: '2026-08-31', status: 'Active', description: 'High-intent search keyword ads for luxury SUVs', leads_count: 28, won_count: 3, total_revenue: 32000000, conversion_rate: 10.7 },
  { id: 'camp-3', name: 'Nairobi Auto Expo 2026', slug: 'nairobi-auto-expo-2026', type: 'Trade Show', budget: 850000, start_date: '2026-06-10', end_date: '2026-06-15', status: 'Completed', description: 'Booth showcase at Kenyatta International Convention Centre', leads_count: 95, won_count: 12, total_revenue: 142000000, conversion_rate: 12.6 },
  { id: 'camp-4', name: 'ABM Corporate VIP Direct Mail', slug: 'abm-corporate-vip-direct-mail', type: 'ABM Outreach', budget: 200000, start_date: '2026-07-01', end_date: '2026-08-15', status: 'Active', description: 'Personalized luxury vehicle catalog drops to top 100 CFOs', leads_count: 15, won_count: 4, total_revenue: 54000000, conversion_rate: 26.6 },
  { id: 'camp-5', name: 'EV & Hybrid Social Discovery', slug: 'ev-hybrid-social-discovery', type: 'Paid Social', budget: 180000, start_date: '2026-08-01', end_date: '2026-08-31', status: 'Active', description: 'Instagram & LinkedIn targeting tech founders for EVs', leads_count: 18, won_count: 1, total_revenue: 9500000, conversion_rate: 5.5 }
]

const initialLeadSources = [
  { id: 'src-1', name: 'Direct Search', category: 'lead_source', is_active: true },
  { id: 'src-2', name: 'Google SEM', category: 'lead_source', is_active: true },
  { id: 'src-3', name: 'Referral & Word of Mouth', category: 'lead_source', is_active: true },
  { id: 'src-4', name: 'Trade Show & Expos', category: 'lead_source', is_active: true },
  { id: 'src-5', name: 'Paid Social (LinkedIn/IG)', category: 'lead_source', is_active: true },
  { id: 'src-6', name: 'Email Campaign', category: 'campaign_type', is_active: true },
  { id: 'src-7', name: 'ABM Direct Outreach', category: 'campaign_type', is_active: true },
  { id: 'src-8', name: 'Radio & Billboard', category: 'campaign_type', is_active: false }
]

const initialLogs = [
  { id: 'log-1', lead_id: 'lead-1', lead_name: 'James Mwangi', type: 'call', subject: 'Initial Discovery Call', content: 'Discussed fleet requirements for Apex Logistics. Requested 3x Land Cruiser V8s.', log_date: '2026-07-28 10:30' },
  { id: 'log-2', lead_id: 'lead-1', lead_name: 'James Mwangi', type: 'meeting', subject: 'Formal Proposal Presentation', content: 'Presented KES 24.5M proposal. Client requested trade-in appraisal.', log_date: '2026-08-01 14:00' },
  { id: 'log-3', lead_id: 'lead-3', lead_name: 'Dr. David Ochieng', type: 'demo', subject: 'GLE 400d Test Drive', content: 'Test drive conducted at Westlands showroom. Excellent feedback.', log_date: '2026-07-31 11:15' },
  { id: 'log-4', lead_id: 'lead-5', lead_name: 'Peter Karanja', type: 'email', subject: 'Invoice & Delivery Confirmation', content: 'Sent final tax invoice and scheduled vehicle delivery ceremony.', log_date: '2026-07-27 16:45' },
  { id: 'log-5', lead_id: 'lead-10', lead_name: 'Fatima Abdi', type: 'call', subject: 'Custom Duty Exemption Inquiry', content: 'Advised client on duty-free diplomatic import documentation.', log_date: '2026-08-03 09:20' }
]

const initialTasks = [
  {
    id: 'task-1', parent_id: null, subject: 'Follow up on Apex Logistics V8 Fleet Quote', description: 'Call James Mwangi to confirm residual value on trade-in cars',
    due_date: '2026-08-02 14:00', status: 'pending', priority: 'urgent', category: 'call', assigned_to: 'Alex Kimani', creator_id: 'admin',
    shared_user_ids: ['Sarah Jenkins'], financial_weight: 24500000, taskable_type: 'Opportunity', taskable_id: 'opp-1',
    reminders: [{ id: 'rem-1', value: 15, unit: 'minutes', is_acknowledged: false }],
    children: [
      { id: 'task-1-1', parent_id: 'task-1', subject: 'Verify Toyota V8 Chassis Numbers', description: 'Confirm availability of 3 black metallic units at port', due_date: '2026-08-02 11:00', status: 'completed', priority: 'high', category: 'custom', assigned_to: 'Michael Chen', creator_id: 'Alex Kimani', financial_weight: 0, resolution_note: 'Verified with Mombasa port customs clearance agent.', created_at: '2026-08-01' }
    ],
    created_at: '2026-07-30'
  },
  {
    id: 'task-2', parent_id: null, subject: 'Finalize Nairobi Hospital GLE 400d Lease Contract', description: 'Draft 36-month maintenance & insurance clauses',
    due_date: '2026-08-05 16:30', status: 'ongoing', priority: 'high', category: 'email', assigned_to: 'Alex Kimani', creator_id: 'admin',
    financial_weight: 14800000, taskable_type: 'Opportunity', taskable_id: 'opp-3',
    reminders: [{ id: 'rem-2', value: 1, unit: 'hours', is_acknowledged: false }],
    created_at: '2026-08-03'
  },
  {
    id: 'task-3', parent_id: null, subject: 'Schedule Coastline Tours Safari Roof Demo', description: 'Arrange live demonstration at industrial area workshop',
    due_date: '2026-08-07 10:00', status: 'pending', priority: 'medium', category: 'demo', assigned_to: 'Michael Chen', creator_id: 'admin',
    financial_weight: 18500000, taskable_type: 'Lead', taskable_id: 'lead-4', created_at: '2026-08-04'
  },
  {
    id: 'task-4', parent_id: null, subject: 'Send Q3 Loyalty Campaign Segment Preview', description: 'Review high-value customer inactivity filter',
    due_date: '2026-08-08 09:00', status: 'pending', priority: 'low', category: 'neural_sync', assigned_to: 'Sarah Jenkins', creator_id: 'admin',
    financial_weight: 5000000, taskable_type: 'Project', taskable_id: 'camp-1', created_at: '2026-08-05'
  },
  {
    id: 'task-5', parent_id: null, subject: 'Prepare Executive Vehicle Handover for Dr. David Ochieng', description: 'Complete PDI inspection and ceramic coating signoff',
    due_date: '2026-08-11 11:30', status: 'pending', priority: 'high', category: 'custom', assigned_to: 'Alex Kimani', creator_id: 'admin',
    financial_weight: 18800000, taskable_type: 'Opportunity', taskable_id: 'opp-102', created_at: '2026-08-06'
  }
]

const initialNexusThreads = [
  {
    id: 'th-1', customer_id: 'cust-101', customer_name: 'Apex Logistics (James Mwangi)', subject: 'Service Schedule for Land Cruiser Fleet',
    priority: 'high', status: 'open', last_message_at: '2026-08-04 08:30',
    messages: [
      { id: 'm-1', thread_id: 'th-1', sender_name: 'James Mwangi', is_from_portal: true, content: 'Hi Team, we need to confirm the first 5,000km free service booking date.', created_at: '2026-08-04 08:15' },
      { id: 'm-2', thread_id: 'th-1', sender_name: 'Support Agent (Alex)', is_from_portal: false, content: 'Good morning James! We have reserved Thursday 10:00 AM at Westlands Service Centre.', created_at: '2026-08-04 08:30' }
    ]
  },
  {
    id: 'th-2', customer_id: 'cust-102', customer_name: 'Equator Energy (Grace Mutua)', subject: 'Spare Key Delivery Request',
    priority: 'normal', status: 'resolved', last_message_at: '2026-08-03 16:20',
    messages: [
      { id: 'm-3', thread_id: 'th-2', sender_name: 'Grace Mutua', is_from_portal: true, content: 'Please courier the duplicate smart key to our HQ in Upperhill.', created_at: '2026-08-03 14:00' },
      { id: 'm-4', thread_id: 'th-2', sender_name: 'Support Agent (Sarah)', is_from_portal: false, content: 'Key dispatched via DHL Tracking #KE99823. Ticket resolved.', created_at: '2026-08-03 16:20' }
    ]
  }
]

const initialSLA = [
  { id: 'sla-1', customer_tier: 'Platinum', avg_response_min: 8, compliance_percent: 99.4, escalation_count: 0 },
  { id: 'sla-2', customer_tier: 'Gold', avg_response_min: 24, compliance_percent: 96.8, escalation_count: 1 },
  { id: 'sla-3', customer_tier: 'Silver', avg_response_min: 45, compliance_percent: 92.1, escalation_count: 3 },
  { id: 'sla-4', customer_tier: 'Standard', avg_response_min: 110, compliance_percent: 88.5, escalation_count: 7 }
]

const initialChannelSLAs = [
  { key: 'viewing', label: 'Test Drive / Viewing Bookings', target_min: 10, avg_response_min: 6, compliance_percent: 98.0, total_requests: 34 },
  { key: 'tradein', label: 'Trade-In Photo Appraisals', target_min: 20, avg_response_min: 14, compliance_percent: 95.2, total_requests: 21 },
  { key: 'whatsapp', label: 'WhatsApp Chat Initiations', target_min: 5, avg_response_min: 3, compliance_percent: 99.1, total_requests: 89 },
  { key: 'webform', label: 'Web Quote & Inquiry Forms', target_min: 30, avg_response_min: 22, compliance_percent: 91.5, total_requests: 52 },
  { key: 'support', label: 'Customer Support Tickets', target_min: 60, avg_response_min: 41, compliance_percent: 94.0, total_requests: 18 }
]

const initialRepVelocity = [
  { id: 'rep-1', name: 'James Mwangi', role: 'Senior AE', leads_assigned: 28, avg_response_min: 7, compliance_percent: 98.5, breaches: 0, status: 'Top Performer' },
  { id: 'rep-2', name: 'Sarah Jenkins', role: 'Sales Specialist', leads_assigned: 22, avg_response_min: 12, compliance_percent: 95.0, breaches: 1, status: 'On Track' },
  { id: 'rep-3', name: 'Grace Mutua', role: 'Account Executive', leads_assigned: 19, avg_response_min: 21, compliance_percent: 91.2, breaches: 2, status: 'On Track' },
  { id: 'rep-4', name: 'Brian Otieno', role: 'Junior Rep', leads_assigned: 14, avg_response_min: 38, compliance_percent: 82.0, breaches: 4, status: 'Needs Improvement' }
]

const initialTeamMembers = [
  {
    id: 'usr-101',
    name: 'Alex Kimani',
    email: 'a.kimani@fuseautomotive.co.ke',
    phone: '+254 722 100 200',
    role: 'Senior Executive',
    department: 'Sales',
    status: 'active',
    access_level: 'Admin',
    assigned_leads_count: 5,
    avatar_url: '',
    created_at: '2026-01-15'
  },
  {
    id: 'usr-102',
    name: 'Michael Chen',
    email: 'm.chen@fuseautomotive.co.ke',
    phone: '+254 733 456 789',
    role: 'Logistics Manager',
    department: 'Operations',
    status: 'active',
    access_level: 'Manager',
    assigned_leads_count: 3,
    avatar_url: '',
    created_at: '2026-02-01'
  },
  {
    id: 'usr-103',
    name: 'Sarah Wanjiku',
    email: 's.wanjiku@fuseautomotive.co.ke',
    phone: '+254 711 987 654',
    role: 'CRM Specialist',
    department: 'Marketing',
    status: 'active',
    access_level: 'Executive',
    assigned_leads_count: 4,
    avatar_url: '',
    created_at: '2026-03-10'
  },
  {
    id: 'usr-104',
    name: 'David Omondi',
    email: 'd.omondi@fuseautomotive.co.ke',
    phone: '+254 700 555 123',
    role: 'Finance Officer',
    department: 'Accounts',
    status: 'active',
    access_level: 'Manager',
    assigned_leads_count: 2,
    avatar_url: '',
    created_at: '2026-03-15'
  },
  {
    id: 'usr-105',
    name: 'Grace Mutua',
    email: 'g.mutua@fuseautomotive.co.ke',
    phone: '+254 799 444 888',
    role: 'Support Lead',
    department: 'Support',
    status: 'active',
    access_level: 'Executive',
    assigned_leads_count: 3,
    avatar_url: '',
    created_at: '2026-04-01'
  },
  {
    id: 'usr-106',
    name: 'Sarah Jenkins',
    email: 's.jenkins@fuseautomotive.co.ke',
    phone: '+254 788 333 999',
    role: 'Senior Sales Specialist',
    department: 'Sales',
    status: 'active',
    access_level: 'Executive',
    assigned_leads_count: 4,
    avatar_url: '',
    created_at: '2026-04-20'
  }
]


const initialAppointments = [
  {
    id: 'app-1',
    lead_id: 'lead-1',
    lead_name: 'James Mwangi',
    phone: '+254712345678',
    email: 'j.mwangi@apexlogistics.co.ke',
    vehicle_name: 'Toyota Land Cruiser V8 ZX (2024)',
    vehicle_id: 'veh-101',
    appointment_date: '2026-08-10',
    appointment_time: '10:00 AM',
    location_type: 'Showroom VIP Lounge',
    status: 'confirmed',
    notes: 'Requested test drive on offroad track with executive driver.',
    assigned_to: 'Alex Kimani',
    created_at: '2026-08-03'
  },
  {
    id: 'app-2',
    lead_id: 'lead-3',
    lead_name: 'Dr. David Ochieng',
    phone: '+254734567890',
    email: 'd.ochieng@nairobihospital.org',
    vehicle_name: 'Mercedes-Benz GLE 400d AMG Line (2023)',
    vehicle_id: 'veh-102',
    appointment_date: '2026-08-12',
    appointment_time: '02:00 PM',
    location_type: 'Executive Home Delivery',
    status: 'scheduled',
    notes: 'Deliver GLE 400d to Nairobi Hospital executive parking for test drive.',
    assigned_to: 'Alex Kimani',
    created_at: '2026-08-04'
  }
]

export const DEFAULT_SCORING_WEIGHTS = {
  booking_appointment: 5,
  showed_up_viewing: 15,
  tradein_photos: 15,
  buying_timeline: 15,
  form_submitted: 10,
  video_watch_high: 10,
  video_watch_med: 5,
  vehicle_views: 5,
  return_visit: 5,
  whatsapp_click: 5,
  similar_time: 4,
  photo_download: 3,
  blog_view: 3,
  inactivity_decay: -15
}

export const DEFAULT_SCORING_THRESHOLDS = {
  high: 75,
  medium: 45
}

export function calculateLeadScoreDynamic(lead, appointments = [], weights = DEFAULT_SCORING_WEIGHTS, thresholds = DEFAULT_SCORING_THRESHOLDS) {
  if (!lead) return { score: 0, intent_tier: 'LOW', hasBooking: false, hasShowedUp: false }

  const w = { ...DEFAULT_SCORING_WEIGHTS, ...weights }
  const t = { ...DEFAULT_SCORING_THRESHOLDS, ...thresholds }

  const leadApps = appointments.filter(a => a.lead_id === lead.id || (lead.email && a.email === lead.email) || (lead.phone && a.phone === lead.phone))
  const isViewingStage = lead.status === 'viewing' || lead.pipeline_stage === 'Viewing / Test Drive' || lead.stage === 'viewing'
  const hasBooking = isViewingStage || leadApps.length > 0 || !!(lead.behavioral_metrics && lead.behavioral_metrics.appointment_booked)
  const hasShowedUp = leadApps.some(a => a.status === 'completed' || a.status === 'attended' || a.status === 'showed_up') || !!(lead.behavioral_metrics && lead.behavioral_metrics.showed_up)

  let score = 0
  const metrics = lead.behavioral_metrics || {}

  // 1. Lead Booking Appointment
  if (hasBooking) score += Number(w.booking_appointment || 0)

  // 2. Lead Showing Up for Vehicle Viewing
  if (hasShowedUp) score += Number(w.showed_up_viewing || 0)

  // 3. Trade-in appraisal & photos uploaded
  if (metrics.tradein_uploaded) score += Number(w.tradein_photos || 0)

  // 4. Stated buying timeline
  const timelineBase = Number(w.buying_timeline || 0)
  if (lead.buying_timeline === '< 30 days') score += timelineBase
  else if (lead.buying_timeline === '1-3 months') score += Math.round(timelineBase * 0.5)
  else score += Math.round(timelineBase * 0.25)

  // 5. Inquiry Form Filled & Submitted
  if ((metrics.forms_submitted || 0) >= 1) score += Number(w.form_submitted || 0)

  // 6. Video Walkthrough Watched
  const maxVideoPct = metrics.max_video_pct || 0
  if (maxVideoPct >= 75) score += Number(w.video_watch_high || 0)
  else if (maxVideoPct >= 50) score += Number(w.video_watch_med || 0)

  // 7. Vehicle Detail Pages Viewed (>= 4)
  if ((metrics.vehicle_views || 0) >= 4) score += Number(w.vehicle_views || 0)

  // 8. Return Visit within 7 Days
  if (metrics.returns_7d === true) score += Number(w.return_visit || 0)

  // 9. WhatsApp Chat Initiated
  if ((metrics.whatsapp_clicks || 0) > 0) score += Number(w.whatsapp_click || 0)

  // 10. Time Spent Viewing Similar Models (>= 3m)
  if ((metrics.similar_time_min || 0) >= 3) score += Number(w.similar_time || 0)

  // 11. Photo Downloads / Shares
  if ((metrics.photos_downloaded || 0) > 0) score += Number(w.photo_download || 0)

  // 12. Vehicle Blog Articles Read
  if ((metrics.blogs_viewed || 0) > 0) score += Number(w.blog_view || 0)

  // 13. Inactivity Penalty (> 14 Days)
  if (metrics.inactive_14d === true) score += Number(w.inactivity_decay || 0)

  const finalScore = Math.min(100, Math.max(0, score))
  const highThresh = Number(t.high || 75)
  const medThresh = Number(t.medium || 45)
  const intent_tier = finalScore >= highThresh ? 'HIGH' : finalScore >= medThresh ? 'MEDIUM' : 'LOW'

  return {
    score: finalScore,
    intent_tier,
    hasBooking,
    hasShowedUp
  }
}

export const useCRMStore = create((set, get) => ({
  scoringWeights: DEFAULT_SCORING_WEIGHTS,
  scoringThresholds: DEFAULT_SCORING_THRESHOLDS,
  leads: initialLeads,
  opportunities: initialOpportunities,
  appointments: initialAppointments,
  vehicleInventory: initialVehicleInventory,
  campaigns: initialCampaigns,
  leadSources: initialLeadSources,
  communicationLogs: initialLogs,
  tasks: initialTasks,
  nexusThreads: initialNexusThreads,
  slaRecords: initialSLA,
  channelSLAs: initialChannelSLAs,
  repVelocity: initialRepVelocity,
  teamMembers: (() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fuse_team_members')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch (e) { console.error(e) }
    }
    return initialTeamMembers
  })(),
  activeReminders: [],
  liveChatNotificationsEnabled: true,

  // --- Site Branding Settings (shared across admin & client) ---
  siteSettings: (() => {
    const defaultSettings = {
      brandPrefix: 'Fuse',
      brandSuffix: 'Automotive',
      logoUrl: '/images/fuse-logo-horizontal.png',
      subtitle: 'ADMIN PORTAL',
    };
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fuse_site_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.logoUrl === '/logo.svg' || !parsed.logoUrl)) {
            parsed.logoUrl = '/images/fuse-logo-horizontal.png';
            localStorage.setItem('fuse_site_settings', JSON.stringify(parsed));
          }
          return { ...defaultSettings, ...parsed };
        }
      } catch (e) { console.error(e); }
    }
    return defaultSettings;
  })(),

  updateSiteSettings: (updates) => {
    set(state => {
      const next = { ...state.siteSettings, ...updates }
      if (typeof window !== 'undefined') {
        localStorage.setItem('fuse_site_settings', JSON.stringify(next))
      }
      api.put('/crm/site-settings', next).catch(console.error)
      return { siteSettings: next }
    })
  },

  saveChatLead: async (leadData) => {
    const id = `chat-lead-${Date.now()}`
    const chatLeadRecord = {
      id,
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || null,
      source: 'Live Support Chat',
      notes: leadData.notes || 'Captured via live chat widget',
      status: 'new',
      conversion_probability: 70,
      intent_score: 75,
      intent_tier: 'HIGH',
      ip_address: leadData.ip_address || '102.217.155.84',
      latitude: leadData.latitude || -1.286389,
      longitude: leadData.longitude || 36.817223,
      location_name: leadData.location_name || 'Nairobi, Kenya',
      browser: leadData.browser || 'Chrome 126.0',
      device: leadData.device || 'Mobile (Android 14)',
      os: leadData.os || 'Android 14',
      captured_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }

    const digits = leadData.phone ? leadData.phone.replace(/\D/g, '') : `${Date.now()}`
    const crmLeadRecord = {
      id: `lead-chat-${digits}`,
      name: leadData.name,
      email: leadData.email || `${leadData.name.toLowerCase().replace(/\s+/g, '.')}@chatlead.knk`,
      phone: leadData.phone,
      company: 'Live Support Visitor',
      source: 'Live Support Chat',
      status: 'new',
      conversion_probability: 8,
      intent_score: 8,
      intent_tier: 'LOW',
      buying_timeline: '1-3 months',
      behavioral_metrics: {
        vehicle_views: 0, returns_7d: false, similar_time_min: 0,
        forms_submitted: 0, videos_watched: 0, max_video_pct: 0,
        appointment_booked: false, showed_up: false, whatsapp_clicks: 0,
        blogs_viewed: 0, photos_downloaded: 0, tradein_uploaded: false
      },
      notes: `Captured via live support chat widget. Location: ${leadData.location_name || 'Nairobi, Kenya'} (${leadData.ip_address || '102.217.155.84'})`,
      ip_address: leadData.ip_address || '102.217.155.84',
      latitude: leadData.latitude || -1.286389,
      longitude: leadData.longitude || 36.817223,
      location_name: leadData.location_name || 'Nairobi, Kenya',
      browser: leadData.browser || 'Chrome 126.0',
      device: leadData.device || 'Mobile (Android 14)',
      os: leadData.os || 'Android 14',
      created_at: new Date().toISOString().split('T')[0]
    }

    const chatOppRecord = {
      id: `opp-chat-${digits}`,
      lead_id: crmLeadRecord.id,
      name: `${crmLeadRecord.name} Live Chat Inquiry`,
      expected_value: 12500000,
      close_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      probability: 70,
      stage: 'new_lead',
      updated_at: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0]
    }

    // Save locally
    if (typeof window !== 'undefined') {
      localStorage.setItem('knk_chat_visitor_lead', JSON.stringify(leadData))
    }

    // Fail-safe dual persistence to both Express API AND Direct Supabase Cloud (for live server)
    try {
      await Promise.allSettled([
        api.post('/crm/chat-leads', chatLeadRecord),
        supabase.from('crm_chat_leads').upsert(chatLeadRecord),
        supabase.from('crm_leads').upsert(crmLeadRecord),
        supabase.from('crm_opportunities').upsert(chatOppRecord)
      ])
      set(state => ({
        opportunities: [chatOppRecord, ...(state.opportunities || []).filter(o => o.id !== chatOppRecord.id)]
      }))
      await get().syncLeads()
    } catch (err) {
      console.error('Error persisting chat lead:', err)
    }
  },

  isLoading: false,

  // --- Initializer: Hydrate state from Local PostgreSQL via Express REST API ---
  initCRM: async () => {
    set({ isLoading: true })

    // Attach global storage event listener for multi-window real-time chat sync
    if (typeof window !== 'undefined' && !window.__knk_storage_listener_attached) {
      window.__knk_storage_listener_attached = true
      window.addEventListener('storage', (e) => {
        if (!e.key || e.key === 'knk_nexus_threads') {
          try {
            const saved = localStorage.getItem('knk_nexus_threads')
            if (saved) {
              const parsed = JSON.parse(saved)
              if (Array.isArray(parsed) && parsed.length) {
                set({ nexusThreads: parsed })
              }
            }
          } catch { /* ignore */ }
        }
      })
    }

    try {
      const [leads, opps, camps, tasks, sources, logs, threads, sla, channelSla, settings, reps, appts] = await Promise.all([
        api.get('/crm/leads').catch(() => null),
        api.get('/crm/opportunities').catch(() => null),
        api.get('/crm/campaigns').catch(() => null),
        api.get('/crm/tasks').catch(() => null),
        api.get('/crm/lead-sources').catch(() => null),
        api.get('/crm/activity-logs').catch(() => null),
        api.get('/crm/support-threads').catch(() => null),
        api.get('/crm/sla-metrics').catch(() => null),
        api.get('/crm/sla-channels').catch(() => null),
        api.get('/crm/site-settings').catch(() => null),
        api.get('/crm/rep-velocity').catch(() => null),
        api.get('/crm/appointments').catch(() => null)
      ])

      let fetchedAppts = appts
      if (!fetchedAppts || !fetchedAppts.length) {
        try {
          const { data } = await supabase.from('crm_appointments').select('*').order('created_at', { ascending: false })
          if (data && data.length > 0) fetchedAppts = data
        } catch { /* ignore */ }
      }

      let fetchedLeads = leads
      if (!fetchedLeads || !fetchedLeads.length) {
        try {
          const { data } = await supabase.from('crm_leads').select('*').order('created_at', { ascending: false })
          if (data && data.length > 0) fetchedLeads = data
        } catch { /* ignore */ }
      }

      let fetchedTasks = tasks
      if (!fetchedTasks || !fetchedTasks.length) {
        try {
          const { data } = await supabase.from('crm_tasks').select('*').order('created_at', { ascending: false })
          if (data && data.length > 0) fetchedTasks = data
        } catch { /* ignore */ }
      }

      let fetchedCamps = camps
      if (!fetchedCamps || !fetchedCamps.length) {
        try {
          const { data } = await supabase.from('crm_campaigns').select('*')
          if (data && data.length > 0) fetchedCamps = data
        } catch { /* ignore */ }
      }

      let fetchedSources = sources
      if (!fetchedSources || !fetchedSources.length) {
        try {
          const { data } = await supabase.from('crm_lead_sources').select('*')
          if (data && data.length > 0) fetchedSources = data
        } catch { /* ignore */ }
      }

      let localOpps = null
      if (typeof window !== 'undefined') {
        try { localOpps = JSON.parse(localStorage.getItem('knk_crm_opportunities') || 'null') } catch { /* ignore */ }
      }

      let fetchedOpps = opps
      if (!fetchedOpps || !fetchedOpps.length) {
        try {
          const { data } = await supabase.from('crm_opportunities').select('*').order('created_at', { ascending: false })
          if (data && data.length > 0) fetchedOpps = data
        } catch { /* ignore */ }
      }

      let finalOpps = initialOpportunities
      if (fetchedOpps && fetchedOpps.length) {
        if (localOpps && localOpps.length) {
          const map = new Map()
          fetchedOpps.forEach(o => map.set(o.id, o))
          localOpps.forEach(o => map.set(o.id, { ...(map.get(o.id) || {}), ...o }))
          finalOpps = Array.from(map.values())
        } else {
          finalOpps = fetchedOpps
        }
      } else if (localOpps && localOpps.length) {
        finalOpps = localOpps
      }

      const LEGACY_STAGE_MAP = { proposal: 'viewing', qualification: 'qualified', negotiation: 'deposit' }
      finalOpps = finalOpps.map(o => ({
        ...o,
        stage: LEGACY_STAGE_MAP[o.stage] || o.stage || 'new_lead'
      }))

      if (typeof window !== 'undefined' && finalOpps) {
        try { localStorage.setItem('knk_crm_opportunities', JSON.stringify(finalOpps)) } catch { /* ignore */ }
      }

      const finalThreads = (threads && threads.length) ? threads : get().nexusThreads
      if (typeof window !== 'undefined' && finalThreads) {
        try { localStorage.setItem('knk_nexus_threads', JSON.stringify(finalThreads)) } catch { /* ignore */ }
      }

      let fetchedLogs = logs
      if (!fetchedLogs || !fetchedLogs.length) {
        try {
          const { data } = await supabase.from('crm_activity_logs').select('*').order('created_at', { ascending: false })
          if (data && data.length > 0) fetchedLogs = data
        } catch { /* ignore */ }
      }

      let fetchedSla = sla
      if (!fetchedSla || !fetchedSla.length) {
        try {
          const { data } = await supabase.from('crm_sla_metrics').select('*')
          if (data && data.length > 0) fetchedSla = data
        } catch { /* ignore */ }
      }

      let fetchedSettings = settings
      if (!fetchedSettings || !Object.keys(fetchedSettings || {}).length) {
        try {
          const { data } = await supabase.from('crm_site_settings').select('*')
          if (data && data.length > 0) {
            fetchedSettings = {}
            data.forEach(item => { fetchedSettings[item.key] = item.value })
          }
        } catch { /* ignore */ }
      }

      let fetchedReps = reps
      if (!fetchedReps || !fetchedReps.length) {
        try {
          const { data } = await supabase.from('crm_rep_velocity').select('*')
          if (data && data.length > 0) fetchedReps = data
        } catch { /* ignore */ }
      }

      set({
        appointments: (fetchedAppts && fetchedAppts.length) ? fetchedAppts : initialAppointments,
        leads: deduplicateLeads((fetchedLeads && fetchedLeads.length) ? fetchedLeads : initialLeads),
        opportunities: finalOpps,
        campaigns: (fetchedCamps && fetchedCamps.length) ? fetchedCamps : initialCampaigns,
        tasks: (fetchedTasks && fetchedTasks.length) ? fetchedTasks : initialTasks,
        leadSources: (fetchedSources && fetchedSources.length) ? fetchedSources : initialLeadSources,
        communicationLogs: (fetchedLogs && fetchedLogs.length) ? fetchedLogs : initialLogs,
        nexusThreads: finalThreads,
        slaRecords: (fetchedSla && fetchedSla.length) ? fetchedSla : initialSLA,
        channelSLAs: (channelSla && channelSla.length) ? channelSla : initialChannelSLAs,
        siteSettings: (fetchedSettings && Object.keys(fetchedSettings).length) ? { ...get().siteSettings, ...fetchedSettings } : get().siteSettings,
        repVelocity: (fetchedReps && fetchedReps.length) ? fetchedReps : initialRepVelocity,
        isLoading: false
      })

      // Immediately sync leads, threads, and appointments from Supabase Cloud on store initialization
      get().syncLeads()
      get().syncSupportThreads()
      get().syncAppointments()

      // Start 60-second Live Chat & Leads polling daemon for background admin sync across windows/devices
      if (typeof window !== 'undefined' && !window.__knk_support_poller) {
        window.__knk_support_poller = setInterval(() => {
          get().syncSupportThreads()
          get().syncLeads()
          get().syncAppointments()
        }, 60000)
      }

      // Setup Supabase Realtime channel for instant remote live chat popups & notifications across devices
      if (typeof window !== 'undefined' && !window.__knk_supabase_realtime) {
        window.__knk_supabase_realtime = supabase
          .channel('crm_remote_live')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_support_threads' }, () => {
            get().syncSupportThreads()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_support_messages' }, () => {
            get().syncSupportThreads()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_leads' }, () => {
            get().syncLeads()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_appointments' }, () => {
            get().syncAppointments()
          })
          .subscribe()
      }
    } catch {
      set({ isLoading: false })
    }
  },

  syncAppointments: async () => {
    try {
      const [apiRes, supaRes] = await Promise.allSettled([
        api.get('/crm/appointments'),
        supabase.from('crm_appointments').select('*').order('created_at', { ascending: false })
      ])

      const apiApps = apiRes.status === 'fulfilled' && Array.isArray(apiRes.value) ? apiRes.value : []
      const supaApps = supaRes.status === 'fulfilled' && Array.isArray(supaRes.value?.data) ? supaRes.value.data : []

      const appMap = new Map()
      supaApps.forEach(a => appMap.set(a.id, a))
      apiApps.forEach(a => {
        if (!appMap.has(a.id)) appMap.set(a.id, a)
        else appMap.set(a.id, { ...appMap.get(a.id), ...a })
      })

      const combinedApps = Array.from(appMap.values())
      if (combinedApps.length > 0) {
        set({ appointments: combinedApps })
      }
    } catch {
      /* fallback silent */
    }
  },

  addTeamMember: async (memberData) => {
    const id = memberData.id || `usr-${Date.now()}`
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
    const newMember = {
      id,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone || '',
      role: memberData.role || 'Executive',
      department: memberData.department || 'Sales',
      status: memberData.status || 'active',
      access_level: memberData.access_level || 'Executive',
      assigned_leads_count: 0,
      avatar_url: memberData.avatar_url || '',
      created_at: now
    }

    set(state => {
      const updated = [newMember, ...state.teamMembers]
      if (typeof window !== 'undefined') {
        localStorage.setItem('fuse_team_members', JSON.stringify(updated))
      }
      return { teamMembers: updated }
    })

    try {
      await api.post('/crm/team', newMember).catch(() => null)
      await supabase.from('crm_team_members').upsert(newMember).catch(() => null)
    } catch (e) { console.error(e) }
    return newMember
  },

  updateTeamMember: async (id, updates) => {
    set(state => {
      const updated = state.teamMembers.map(m => m.id === id ? { ...m, ...updates } : m)
      if (typeof window !== 'undefined') {
        localStorage.setItem('fuse_team_members', JSON.stringify(updated))
      }
      return { teamMembers: updated }
    })

    try {
      await api.put(`/crm/team/${id}`, updates).catch(() => null)
      await supabase.from('crm_team_members').update(updates).eq('id', id).catch(() => null)
    } catch (e) { console.error(e) }
  },

  toggleTeamMemberStatus: async (id) => {
    const member = get().teamMembers.find(m => m.id === id)
    if (!member) return
    const newStatus = member.status === 'active' ? 'suspended' : 'active'
    await get().updateTeamMember(id, { status: newStatus })
  },

  removeTeamMember: async (id, reassignToName = null) => {
    const memberToRemove = get().teamMembers.find(m => m.id === id)
    if (!memberToRemove) return

    if (reassignToName) {
      set(state => ({
        leads: state.leads.map(l => l.assigned_to === memberToRemove.name ? { ...l, assigned_to: reassignToName } : l),
        tasks: state.tasks.map(t => t.assigned_to === memberToRemove.name ? { ...t, assigned_to: reassignToName } : t),
        appointments: state.appointments.map(a => a.assigned_to === memberToRemove.name ? { ...a, assigned_to: reassignToName } : a)
      }))
    }

    set(state => {
      const updated = state.teamMembers.filter(m => m.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem('fuse_team_members', JSON.stringify(updated))
      }
      return { teamMembers: updated }
    })

    try {
      await api.delete(`/crm/team/${id}`).catch(() => null)
      await supabase.from('crm_team_members').delete().eq('id', id).catch(() => null)
    } catch (e) { console.error(e) }
  },

  syncLeads: async () => {
    try {
      let strapiLeads = []
      try {
        const sRes = await fetch('http://localhost:1338/api/crm-leads').then(r => r.ok ? r.json() : null)
        if (sRes && Array.isArray(sRes.data)) {
          strapiLeads = sRes.data.map(item => {
            const attr = item.attributes || item
            return {
              id: `strapi-lead-${item.id}`,
              name: attr.name || 'Storefront Visitor',
              email: attr.email || '',
              phone: attr.phone || '',
              source: attr.source || 'Storefront Digital Matrix',
              status: attr.currentStatus || 'new',
              notes: attr.notes || '',
              intent_score: attr.intent_score || 85,
              intent_tier: attr.intent_tier || 'HOT',
              created_at: attr.publishedAt || new Date().toISOString()
            }
          })
        }
      } catch { /* ignore */ }

      const [apiRes, supaRes] = await Promise.allSettled([
        api.get('/crm/leads'),
        supabase.from('crm_leads').select('*').order('created_at', { ascending: false })
      ])

      const apiLeads = apiRes.status === 'fulfilled' && Array.isArray(apiRes.value) ? apiRes.value : []
      const supaLeads = supaRes.status === 'fulfilled' && Array.isArray(supaRes.value?.data) ? supaRes.value.data : []

      const leadMap = new Map()
      strapiLeads.forEach(l => leadMap.set(l.id, l))
      supaLeads.forEach(l => leadMap.set(l.id, l))
      apiLeads.forEach(l => {
        if (!leadMap.has(l.id)) leadMap.set(l.id, l)
        else leadMap.set(l.id, { ...leadMap.get(l.id), ...l })
      })

      const rawLeads = Array.from(leadMap.values())
      if (rawLeads.length > 0) {
        const appointments = get().appointments || []
        const weights = get().scoringWeights
        const thresholds = get().scoringThresholds

        const processed = deduplicateLeads(rawLeads).map(lead => {
          const { score, intent_tier, hasBooking, hasShowedUp } = calculateLeadScoreDynamic(lead, appointments, weights, thresholds)
          return {
            ...lead,
            intent_score: score,
            conversion_probability: score,
            intent_tier,
            behavioral_metrics: {
              ...(lead.behavioral_metrics || {}),
              appointment_booked: hasBooking,
              showed_up: hasShowedUp
            }
          }
        })
        set({ leads: processed })
      }
    } catch {
      /* fallback silent */
    }
  },

  syncSupportThreads: async () => {
    try {
      const [apiRes, supaThreadsRes, supaMsgsRes] = await Promise.allSettled([
        api.get('/crm/support-threads'),
        supabase.from('crm_support_threads').select('*').order('last_message_at', { ascending: false }),
        supabase.from('crm_support_messages').select('*').order('created_at', { ascending: true })
      ])

      const apiThreads = apiRes.status === 'fulfilled' && Array.isArray(apiRes.value) ? apiRes.value : []
      const supaThreads = supaThreadsRes.status === 'fulfilled' && Array.isArray(supaThreadsRes.value?.data) ? supaThreadsRes.value.data : []
      const supaMsgs = supaMsgsRes.status === 'fulfilled' && Array.isArray(supaMsgsRes.value?.data) ? supaMsgsRes.value.data : []

      const threadMap = new Map()

      // 1. Populate Supabase Cloud threads and messages
      supaThreads.forEach(t => {
        threadMap.set(t.id, {
          ...t,
          messages: sortChatMessages(supaMsgs.filter(m => m.thread_id === t.id))
        })
      })

      // 2. Merge API threads and messages
      apiThreads.forEach(t => {
        if (!threadMap.has(t.id)) {
          threadMap.set(t.id, {
            ...t,
            messages: sortChatMessages(t.messages || [])
          })
        } else {
          const existing = threadMap.get(t.id)
          const msgMap = new Map()
          ;(existing.messages || []).forEach(m => msgMap.set(m.id, m))
          ;(t.messages || []).forEach(m => msgMap.set(m.id, m))
          const mergedMsgs = sortChatMessages(Array.from(msgMap.values()))
          threadMap.set(t.id, { ...existing, ...t, messages: mergedMsgs })
        }
      })

      const combinedThreads = Array.from(threadMap.values()).sort((a, b) => (b.last_message_at || '').localeCompare(a.last_message_at || ''))
      if (combinedThreads.length > 0) {
        set({ nexusThreads: combinedThreads })
      }
    } catch {
      /* fallback silent */
    }
  },

  toggleLiveChatNotifications: () => set(state => ({
    liveChatNotificationsEnabled: !state.liveChatNotificationsEnabled
  })),

  // --- Appointment Mutations ---
  addAppointment: async (appData) => {
    const newApp = {
      id: `app-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      status: 'scheduled',
      assigned_to: 'Alex Kimani',
      ...appData
    }

    const currentApps = get().appointments || []
    const updatedApps = [newApp, ...currentApps.filter(a => a.id !== newApp.id)]
    set({ appointments: updatedApps })

    if (typeof window !== 'undefined') {
      try { localStorage.setItem('knk_crm_appointments', JSON.stringify(updatedApps)) } catch { /* ignore */ }
    }

    try {
      await supabase.from('crm_appointments').upsert(newApp)
    } catch (e) {
      console.warn('Supabase appointment upsert error:', e)
    }

    // Auto-advance lead & opportunity, set appointment_booked = true
    if (appData.lead_id) {
      set(state => ({
        leads: state.leads.map(l => (l.id === appData.lead_id || (appData.email && l.email === appData.email)) ? {
          ...l,
          pipeline_stage: 'Viewing / Test Drive',
          behavioral_metrics: {
            ...(l.behavioral_metrics || {}),
            appointment_booked: true
          }
        } : l)
      }))
      setTimeout(() => get().recalculateLeadScore(appData.lead_id), 50)
    }

    return newApp
  },

  updateAppointmentStatus: (id, status) => {
    let affectedLeadId = null
    set(state => {
      const targetApp = (state.appointments || []).find(a => a.id === id)
      affectedLeadId = targetApp?.lead_id
      const updatedApps = (state.appointments || []).map(a => a.id === id ? { ...a, status } : a)
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('knk_crm_appointments', JSON.stringify(updatedApps)) } catch { /* ignore */ }
      }

      let updatedLeads = state.leads
      if (affectedLeadId) {
        const isShowedUp = status === 'completed' || status === 'attended' || status === 'showed_up'
        const isConfirmedOrBooked = status === 'confirmed' || status === 'scheduled' || isShowedUp
        updatedLeads = state.leads.map(l => l.id === affectedLeadId ? {
          ...l,
          behavioral_metrics: {
            ...(l.behavioral_metrics || {}),
            appointment_booked: isConfirmedOrBooked ? true : l.behavioral_metrics?.appointment_booked,
            showed_up: isShowedUp ? true : l.behavioral_metrics?.showed_up
          }
        } : l)
      }

      return { appointments: updatedApps, leads: updatedLeads }
    })
    supabase.from('crm_appointments').update({ status }).eq('id', id).then().catch(console.error)
    if (affectedLeadId) {
      setTimeout(() => get().recalculateLeadScore(affectedLeadId), 50)
    }
  },

  // --- Lead Mutations ---
  addLead: (lead) => {
    set(state => {
      const currentLeads = state.leads || []
      const candidateLead = {
        id: lead.id || `lead-${Date.now()}`,
        created_at: new Date().toISOString().split('T')[0],
        status: 'new',
        conversion_probability: 50,
        ...lead
      }

      // Run deduplication to see if candidate lead merges into an existing lead
      const mergedLeads = deduplicateLeads([candidateLead, ...currentLeads])
      const finalTarget = mergedLeads.find(l => 
        l.id === candidateLead.id || 
        (candidateLead.phone && l.phone && l.phone.replace(/\D/g, '') === candidateLead.phone.replace(/\D/g, '')) ||
        (candidateLead.email && !candidateLead.email.endsWith('@chatlead.knk') && l.email && l.email.toLowerCase() === candidateLead.email.toLowerCase())
      ) || candidateLead

      const isUpdate = currentLeads.some(l => l.id === finalTarget.id)

      if (isUpdate) {
        api.put(`/crm/leads/${finalTarget.id}`, finalTarget).catch(console.error)
        supabase.from('crm_leads').upsert(finalTarget).then().catch(console.error)
      } else {
        const newOpp = {
          id: `opp-${Date.now()}`,
          lead_id: finalTarget.id,
          name: `${finalTarget.company && finalTarget.company !== '—' ? finalTarget.company : finalTarget.name} Pursuit`,
          expected_value: 15000000,
          close_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
          probability: finalTarget.conversion_probability || 50,
          stage: 'new_lead',
          updated_at: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString().split('T')[0]
        }
        api.post('/crm/leads', finalTarget).catch(console.error)
        api.post('/crm/opportunities', newOpp).catch(console.error)
        supabase.from('crm_leads').upsert(finalTarget).then().catch(console.error)
        supabase.from('crm_opportunities').upsert(newOpp).then().catch(console.error)
      }

      return { leads: mergedLeads }
    })
  },

  updateLead: (id, updates) => {
    set(state => ({ leads: state.leads.map(l => l.id === id ? { ...l, ...updates } : l) }))
    api.put(`/crm/leads/${id}`, updates).catch(console.error)
  },

  toggleLeadCriterion: (leadId, criterionKey, forceVal = null) => {
    set(state => {
      const lead = state.leads.find(l => l.id === leadId)
      if (!lead) return {}
      const currentVal = lead.behavioral_metrics?.[criterionKey]
      const newVal = forceVal !== null ? forceVal : !currentVal
      const updatedMetrics = {
        ...(lead.behavioral_metrics || {}),
        [criterionKey]: newVal
      }
      const updatedLeads = state.leads.map(l => l.id === leadId ? { ...l, behavioral_metrics: updatedMetrics } : l)
      return { leads: updatedLeads }
    })
    setTimeout(() => get().recalculateLeadScore(leadId), 50)
  },
  setScoringRules: (weights, thresholds) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fuse_scoring_weights', JSON.stringify(weights))
      localStorage.setItem('fuse_scoring_thresholds', JSON.stringify(thresholds))
    }
    set({ scoringWeights: weights, scoringThresholds: thresholds })
    api.put('/crm/scoring-rules', { weights, thresholds }).catch(console.error)
    get().recalculateAllLeads()
  },

  recalculateAllLeads: () => {
    set(state => {
      const appointments = state.appointments || []
      const weights = state.scoringWeights
      const thresholds = state.scoringThresholds

      const updatedLeads = state.leads.map(lead => {
        const { score, intent_tier, hasBooking, hasShowedUp } = calculateLeadScoreDynamic(lead, appointments, weights, thresholds)
        const updated = {
          ...lead,
          intent_score: score,
          conversion_probability: score,
          intent_tier,
          behavioral_metrics: {
            ...lead.behavioral_metrics,
            appointment_booked: hasBooking,
            showed_up: hasShowedUp
          }
        }
        api.put(`/crm/leads/${lead.id}`, { intent_score: score, conversion_probability: score, intent_tier }).catch(() => {})
        supabase.from('crm_leads').update({ intent_score: score, conversion_probability: score, intent_tier, behavioral_metrics: updated.behavioral_metrics }).eq('id', lead.id).then().catch(() => {})
        return updated
      })

      return { leads: updatedLeads }
    })
  },

  recalculateLeadScore: (id) => {
    set(state => {
      const lead = state.leads.find(l => l.id === id)
      if (!lead) return {}
      const appointments = state.appointments || []
      const weights = state.scoringWeights
      const thresholds = state.scoringThresholds

      const { score, intent_tier, hasBooking, hasShowedUp } = calculateLeadScoreDynamic(lead, appointments, weights, thresholds)

      const updatedLead = {
        ...lead,
        intent_score: score,
        conversion_probability: score,
        intent_tier,
        behavioral_metrics: {
          ...lead.behavioral_metrics,
          appointment_booked: hasBooking,
          showed_up: hasShowedUp
        }
      }

      // Fire-and-forget: sync the calculated score to the server
      api.put(`/crm/leads/${id}`, { intent_score: score, conversion_probability: score, intent_tier }).catch(() => {})
      supabase.from('crm_leads').update({ intent_score: score, conversion_probability: score, intent_tier, behavioral_metrics: updatedLead.behavioral_metrics }).eq('id', id).then().catch(() => {})

      return {
        leads: state.leads.map(l => l.id === id ? updatedLead : l)
      }
    })
  },

  updateLeadTimeline: (leadId, buying_timeline) => {
    set(state => ({
      leads: state.leads.map(l => l.id === leadId ? { ...l, buying_timeline } : l)
    }))
    api.put(`/crm/leads/${leadId}`, { buying_timeline }).catch(console.error)
  },

  convertLeadToCustomer: (leadId, customerDetails) => {
    const state = get()
    const lead = state.leads.find(l => l.id === leadId)
    const updatedLeads = state.leads.map(l => l.id === leadId ? { ...l, status: 'converted', conversion_probability: 100 } : l)

    const newOpp = {
      id: `opp-${Date.now()}`,
      lead_id: leadId,
      name: `${customerDetails.company || lead?.company || lead?.name} Purchase Deal`,
      expected_value: Number(customerDetails.budget) || 10000000,
      close_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      probability: 80,
      stage: 'proposal',
      updated_at: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0]
    }

    set({ leads: updatedLeads, opportunities: [newOpp, ...state.opportunities] })
    api.put(`/crm/leads/${leadId}`, { status: 'converted', conversion_probability: 100 }).catch(console.error)
    api.post('/crm/opportunities', newOpp).catch(console.error)
  },

  archiveLead: (leadId) => {
    set(state => ({ leads: state.leads.map(l => l.id === leadId ? { ...l, status: 'archived' } : l) }))
    api.put(`/crm/leads/${leadId}`, { status: 'archived' }).catch(console.error)
  },

  restoreLead: (leadId) => {
    set(state => ({ leads: state.leads.map(l => l.id === leadId ? { ...l, status: 'qualified' } : l) }))
    api.put(`/crm/leads/${leadId}`, { status: 'qualified' }).catch(console.error)
  },

  deleteLeadPermanently: (leadId) => {
    set(state => ({
      leads: (state.leads || []).filter(l => l.id !== leadId),
      opportunities: (state.opportunities || []).filter(o => o.lead_id !== leadId)
    }))
    api.delete(`/crm/leads/${leadId}`).catch(console.error)
    supabase.from('crm_leads').delete().eq('id', leadId).then().catch(console.error)
  },

  // --- Opportunity Mutations ---
  addOpportunity: async (opp) => {
    const newOpp = {
      id: opp.id || `opp-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      ...opp,
      expected_value: Number(opp.expected_value) || 0,
      probability: Number(opp.probability) || 50
    }

    // 1. Immediate in-memory state update
    const currentOpps = get().opportunities || []
    const updatedList = [newOpp, ...currentOpps.filter(o => o.id !== newOpp.id)]
    set({ opportunities: updatedList })

    // 2. Primary Database Persistence: Express API + Supabase Cloud Direct Upsert
    let saved = null
    try {
      saved = await api.post('/crm/opportunities', newOpp)
    } catch (err) {
      console.warn('Backend API POST /crm/opportunities failed, trying direct Supabase sync:', err.message)
    }

    try {
      const { data, error } = await supabase.from('crm_opportunities').upsert(newOpp, { onConflict: 'id' }).select()
      if (!error && data && data.length > 0) {
        saved = data[0]
      }
    } catch (subErr) {
      console.warn('Supabase direct upsert failed:', subErr)
    }

    if (saved && saved.id) {
      set(state => ({
        opportunities: state.opportunities.map(o => o.id === newOpp.id ? { ...newOpp, ...saved } : o)
      }))
      return saved
    }

    return newOpp
  },

  updateOpportunityStage: async (oppId, newStage) => {
    const prob = newStage === 'won' ? 100 : newStage === 'lost' ? 0 : undefined
    const nextDate = new Date().toISOString().split('T')[0]

    const updatedList = (get().opportunities || []).map(o => o.id === oppId ? {
      ...o, stage: newStage, updated_at: nextDate,
      probability: prob !== undefined ? prob : o.probability
    } : o)
    set({ opportunities: updatedList })

    const payload = { stage: newStage, updated_at: nextDate, ...(prob !== undefined ? { probability: prob } : {}) }
    api.put(`/crm/opportunities/${oppId}`, payload).catch(() => {})
    try {
      await supabase.from('crm_opportunities').update(payload).eq('id', oppId)
    } catch (e) { console.warn('Supabase stage update failed:', e) }

    return { id: oppId, ...payload }
  },

  updateOpportunity: async (id, updates) => {
    const cleaned = {
      ...updates,
      expected_value: updates.expected_value !== undefined ? Number(updates.expected_value) || 0 : undefined,
      probability: updates.probability !== undefined ? Number(updates.probability) || 0 : undefined,
      updated_at: new Date().toISOString().split('T')[0]
    }

    const updatedList = (get().opportunities || []).map(o => o.id === id ? { ...o, ...cleaned } : o)
    set({ opportunities: updatedList })

    api.put(`/crm/opportunities/${id}`, cleaned).catch(() => {})
    try {
      await supabase.from('crm_opportunities').update(cleaned).eq('id', id)
    } catch (e) { console.warn('Supabase update failed:', e) }

    return { id, ...cleaned }
  },

  archiveOpportunity: async (id) => {
    const nextDate = new Date().toISOString().split('T')[0]
    const updatedList = (get().opportunities || []).map(o => o.id === id ? { ...o, stage: 'archived', is_archived: true, updated_at: nextDate } : o)
    set({ opportunities: updatedList })

    api.put(`/crm/opportunities/${id}`, { stage: 'archived', is_archived: true }).catch(() => {})
    try {
      await supabase.from('crm_opportunities').update({ stage: 'archived', is_archived: true, updated_at: nextDate }).eq('id', id)
    } catch { /* ignore */ }
  },

  restoreOpportunity: async (id, targetStage = 'qualification') => {
    const nextDate = new Date().toISOString().split('T')[0]
    const updatedList = (get().opportunities || []).map(o => o.id === id ? { ...o, stage: targetStage, is_archived: false, updated_at: nextDate } : o)
    set({ opportunities: updatedList })

    api.put(`/crm/opportunities/${id}`, { stage: targetStage, is_archived: false }).catch(() => {})
    try {
      await supabase.from('crm_opportunities').update({ stage: targetStage, is_archived: false, updated_at: nextDate }).eq('id', id)
    } catch { /* ignore */ }
  },

  deleteOpportunity: async (id) => {
    const updatedList = (get().opportunities || []).filter(o => o.id !== id)
    set({ opportunities: updatedList })

    api.delete(`/crm/opportunities/${id}`).catch(() => {})
    try {
      await supabase.from('crm_opportunities').delete().eq('id', id)
    } catch { /* ignore */ }
  },

  updateWonDealSubStage: async (oppId, subStage) => {
    const nextDate = new Date().toISOString().split('T')[0]
    const updatedList = (get().opportunities || []).map(o => o.id === oppId ? { ...o, won_substage: subStage, updated_at: nextDate } : o)
    set({ opportunities: updatedList })

    api.put(`/crm/opportunities/${oppId}`, { won_substage: subStage }).catch(() => {})
    try {
      await supabase.from('crm_opportunities').update({ won_substage: subStage, updated_at: nextDate }).eq('id', oppId)
    } catch { /* ignore */ }
  },

  createOnboardingTasks: (opp, lead) => {
    const now = new Date()
    const formatDate = (daysAhead) => {
      const d = new Date(now)
      d.setDate(d.getDate() + daysAhead)
      return `${d.toISOString().split('T')[0]} 10:00`
    }

    const templates = [
      { subject: `Generate Invoice & Agreement — ${opp.name}`, desc: `Prepare tax proforma invoice for KES ${Number(opp.expected_value).toLocaleString()} and sales contract`, days: 1, priority: 'urgent', category: 'email' },
      { subject: `Verify Payment & Financing Terms — ${opp.name}`, desc: 'Confirm wire transfer receipt or bank financing approval letter', days: 2, priority: 'high', category: 'call' },
      { subject: `NTSA Logbook & Plate Transfer — ${opp.name}`, desc: 'Submit TIMS transfer documents and register number plates with NTSA', days: 3, priority: 'high', category: 'custom' },
      { subject: `Comprehensive Motor Insurance — ${opp.name}`, desc: 'Issue insurance cover note & policy certificate before release', days: 3, priority: 'high', category: 'email' },
      { subject: `Pre-Delivery Inspection (PDI) — ${opp.name}`, desc: 'Complete 150-point technical checklist and detailing in workshop', days: 4, priority: 'high', category: 'demo' },
      { subject: `Schedule Handover Ceremony — ${opp.name}`, desc: 'Confirm delivery date, champagne presentation, and client arrival time', days: 5, priority: 'medium', category: 'meeting' },
      { subject: `Handover & Sign Delivery Note — ${opp.name}`, desc: 'Conduct key handover ceremony, explain vehicle features, get delivery signoff', days: 6, priority: 'urgent', category: 'meeting' },
      { subject: `30-Day Vehicle Performance Check — ${opp.name}`, desc: 'Reach out to client for first 1,000km checkup and feedback', days: 30, priority: 'medium', category: 'call' },
      { subject: `90-Day Executive Satisfaction Survey — ${opp.name}`, desc: 'Conduct executive review and discuss maintenance contract / referral', days: 90, priority: 'low', category: 'neural_sync' }
    ]

    const newTasks = templates.map((t, idx) => ({
      id: `task-onboard-${opp.id}-${idx + 1}`,
      parent_id: null,
      subject: t.subject,
      description: t.desc,
      due_date: formatDate(t.days),
      status: 'pending',
      priority: t.priority,
      category: t.category,
      assigned_to: lead?.assigned_to || 'Alex Kimani',
      creator_id: 'system',
      financial_weight: opp.expected_value || 0,
      taskable_type: 'Opportunity',
      taskable_id: opp.id,
      reminders: [{ id: `rem-onboard-${idx}`, value: 30, unit: 'minutes', is_acknowledged: false }],
      created_at: new Date().toISOString().split('T')[0]
    }))

    const currentTasks = get().tasks || []
    const updatedTasks = [...newTasks, ...currentTasks]
    set({ tasks: updatedTasks })
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('knk_crm_tasks', JSON.stringify(updatedTasks)) } catch { /* ignore */ }
    }
  },

  promoteLeadToCustomer: (leadId, opp) => {
    const leads = get().leads || []
    const targetLead = leads.find(l => l.id === leadId)
    const newLtv = ((targetLead?.ltv || 0) + (opp?.expected_value || 0))
    const wonAt = new Date().toISOString().split('T')[0]
    const updatedLeads = leads.map(l => l.id === leadId ? {
      ...l,
      status: 'won',
      is_customer: true,
      ltv: newLtv,
      won_at: wonAt
    } : l)
    set({ leads: updatedLeads })
    api.put(`/crm/leads/${leadId}`, { status: 'won', is_customer: true, ltv: newLtv, won_at: wonAt }).catch(() => {})
    supabase.from('crm_leads').update({ status: 'won', is_customer: true, ltv: newLtv, won_at: wonAt }).eq('id', leadId).then().catch(console.error)
  },

  // --- Campaign Mutations ---
  addCampaign: (camp) => {
    const newCamp = {
      id: `camp-${Date.now()}`,
      slug: camp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      leads_count: 0, won_count: 0, total_revenue: 0, conversion_rate: 0,
      ...camp
    }
    set(state => ({ campaigns: [newCamp, ...state.campaigns] }))
    api.post('/crm/campaigns', newCamp).catch(() => {})
    supabase.from('crm_campaigns').upsert(newCamp, { onConflict: 'id' }).then().catch(console.error)
  },

  reallocateCampaignBudget: (sourceId, targetId, amount) => {
    const state = get()
    let sourceMatch = state.campaigns.find(c => c.id === sourceId || c.type?.toLowerCase().includes('sms') || c.name?.toLowerCase().includes('sms'))
    let targetMatch = state.campaigns.find(c => c.id === targetId || c.type?.toLowerCase().includes('email') || c.name?.toLowerCase().includes('email'))

    if (!sourceMatch && state.campaigns.length > 0) sourceMatch = state.campaigns[0]
    if (!targetMatch && state.campaigns.length > 1) targetMatch = state.campaigns[1]

    if (!sourceMatch || !targetMatch || sourceMatch.id === targetMatch.id) return

    const numAmt = Number(amount) || 50000
    const sourceBudget = Math.max(0, (Number(sourceMatch.budget) || 0) - numAmt)
    const targetBudget = (Number(targetMatch.budget) || 0) + numAmt
    const nextCampaigns = state.campaigns.map(c => {
      if (c.id === sourceMatch.id) return { ...c, budget: sourceBudget }
      if (c.id === targetMatch.id) return { ...c, budget: targetBudget }
      return c
    })

    set({ campaigns: nextCampaigns })
    api.put(`/crm/campaigns/${sourceMatch.id}`, { budget: sourceBudget }).catch(() => {})
    api.put(`/crm/campaigns/${targetMatch.id}`, { budget: targetBudget }).catch(() => {})
    supabase.from('crm_campaigns').update({ budget: sourceBudget }).eq('id', sourceMatch.id).then().catch(console.error)
    supabase.from('crm_campaigns').update({ budget: targetBudget }).eq('id', targetMatch.id).then().catch(console.error)
  },

  launchOmnichannelCampaign: (campaignData) => {
    const id = `camp-${Date.now()}`
    const slug = campaignData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const newCamp = {
      id,
      name: campaignData.name,
      type: campaignData.type || 'Omnichannel Suite',
      status: 'Active',
      budget: Number(campaignData.budget) || 500000,
      spend: 0,
      start_date: campaignData.start_date || new Date().toISOString().split('T')[0],
      end_date: campaignData.end_date || '2026-12-31',
      description: campaignData.description || 'Omnichannel automated launch campaign.',
      slug,
      leads_count: 0,
      won_count: 0,
      total_revenue: 0,
      conversion_rate: 0,
      aligned_vehicle_id: campaignData.vehicle_id || null,
      channels: campaignData.channels || ['Meta Ads', 'WhatsApp', 'Email', 'Showroom QR']
    }
    set(state => ({ campaigns: [newCamp, ...state.campaigns] }))
    api.post('/crm/campaigns', newCamp).catch(() => {})
    supabase.from('crm_campaigns').upsert(newCamp, { onConflict: 'id' }).then().catch(console.error)
  },

  // --- Task Mutations ---
  addTask: (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending',
      reminders: [{ id: `rem-${Date.now()}`, value: 15, unit: 'minutes', is_acknowledged: false }],
      ...task
    }
    set(state => ({ tasks: [newTask, ...state.tasks] }))
    api.post('/crm/tasks', newTask).catch(() => {})
    supabase.from('crm_tasks').upsert(newTask, { onConflict: 'id' }).then().catch(console.error)
  },

  addSubtask: (parentId, subtaskData) => {
    const newSubtask = {
      id: `subtask-${Date.now()}`,
      parent_id: parentId,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending',
      ...subtaskData
    }

    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === parentId) {
          const children = t.children || []
          return { ...t, children: [...children, newSubtask] }
        }
        return t
      })
    }))

    api.post(`/crm/tasks/${parentId}/subtasks`, newSubtask).catch(() => {})
    supabase.from('crm_subtasks').upsert(newSubtask, { onConflict: 'id' }).then().catch(console.error)
  },

  updateSubtaskStatus: (parentId, subtaskId, newStatus, note = '') => {
    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === parentId) {
          const children = (t.children || []).map(st => {
            if (st.id === subtaskId) {
              return { ...st, status: newStatus, resolution_note: note || st.resolution_note }
            }
            return st
          })
          return { ...t, children }
        }
        return t
      })
    }))

    api.put(`/crm/subtasks/${subtaskId}`, { status: newStatus, resolution_note: note }).catch(console.error)
  },

  updateTaskStatus: (id, newStatus) => {
    set(state => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t) }))
    api.put(`/crm/tasks/${id}`, { status: newStatus }).catch(console.error)
  },

  updateTask: (id, updates) => {
    set(state => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }))
    api.put(`/crm/tasks/${id}`, updates).catch(console.error)
  },

  deleteTask: (id) => {
    set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }))
    api.delete(`/crm/tasks/${id}`).catch(console.error)
  },

  completeTask: (id, resolutionNote = '') => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'completed', resolution_note: resolutionNote } : t)
    }))
    api.put(`/crm/tasks/${id}`, { status: 'completed', resolution_note: resolutionNote }).catch(console.error)
  },

  addSubTask: (parentId, subtaskData) => {
    const newSubtask = typeof subtaskData === 'string' ? {
      id: `subtask-${Date.now()}`,
      parent_id: parentId,
      subject: subtaskData,
      title: subtaskData,
      status: 'pending',
      completed: false,
      created_at: new Date().toISOString().split('T')[0]
    } : {
      id: `subtask-${Date.now()}`,
      parent_id: parentId,
      status: 'pending',
      completed: false,
      created_at: new Date().toISOString().split('T')[0],
      ...subtaskData
    }

    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === parentId) {
          const children = t.children || t.subtasks || []
          return { ...t, children: [...children, newSubtask], subtasks: [...children, newSubtask] }
        }
        return t
      })
    }))
    api.post(`/crm/tasks/${parentId}/subtasks`, newSubtask).catch(console.error)
  },

  toggleSubTask: (parentId, subtaskId) => {
    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === parentId) {
          const children = (t.children || t.subtasks || []).map(st => {
            if (st.id === subtaskId) {
              const isCompleted = st.status === 'completed' || st.completed === true
              const nextStatus = isCompleted ? 'pending' : 'completed'
              return { ...st, status: nextStatus, completed: !isCompleted }
            }
            return st
          })
          return { ...t, children, subtasks: children }
        }
        return t
      })
    }))
  },

  archiveTask: (id) => {
    set(state => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'archived' } : t) }))
    api.put(`/crm/tasks/${id}`, { status: 'archived' }).catch(console.error)
  },

  restoreTask: (id) => {
    set(state => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'pending' } : t) }))
    api.put(`/crm/tasks/${id}`, { status: 'pending' }).catch(console.error)
  },

  acknowledgeTaskReminder: (taskId) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        reminders_acknowledged: true,
        is_acknowledged: true,
        reminders: t.reminders ? t.reminders.map(r => ({ ...r, is_acknowledged: true })) : []
      } : t)
    }))
    api.put(`/crm/tasks/${taskId}`, { reminders_acknowledged: true }).catch(console.error)
  },

  snoozeTaskReminder: (taskId, minutes = 15) => {
    const nextDue = new Date(Date.now() + minutes * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16)
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t, due_date: nextDue, reminders: t.reminders ? t.reminders.map(r => ({ ...r, is_acknowledged: false })) : []
      } : t)
    }))
    api.put(`/crm/tasks/${taskId}`, { due_date: nextDue }).catch(console.error)
  },

  addNexusMessage: (threadId, message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16)
    const newMsg = { id: `m-${Date.now()}`, thread_id: threadId, created_at: timestamp, ...message }

    const updatedThreads = get().nexusThreads.map(t => t.id === threadId ? {
      ...t, status: 'open', last_message_at: timestamp,
      messages: sortChatMessages([...t.messages, newMsg])
    } : t)

    set({ nexusThreads: updatedThreads })

    api.post(`/crm/support-threads/${threadId}/messages`, newMsg).catch(() => {})
    supabase.from('crm_support_messages').upsert({
      id: newMsg.id,
      thread_id: newMsg.thread_id,
      sender_name: newMsg.sender_name,
      is_from_portal: newMsg.is_from_portal,
      content: newMsg.content,
      attachment_name: newMsg.attachment_name,
      attachment_type: newMsg.attachment_type,
      attachment_url: newMsg.attachment_url,
      created_at: newMsg.created_at
    }, { onConflict: 'id' }).then(() => {}).catch(console.error)
  },

  sendClientChatMessage: async (senderName, text, attachment, customThreadId, telemetry) => {
    const timestamp = new Date().toISOString()
    const state = get()
    let tel = telemetry || {}

    // Unique per-session/visitor thread ID - NEVER dump into shared 'th-live-client'
    const targetThreadId = customThreadId || `th-live-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
    let thread = state.nexusThreads.find(t => t.id === targetThreadId)

    const phoneMatch = (senderName || '').match(/(\+?\d[\d\s-]{6,})/)
    const extractedPhone = phoneMatch ? phoneMatch[1].replace(/\s+/g, '') : (tel.phone || null)
    const extractedEmail = tel.email || null

    const newMessage = {
      id: `m-${Date.now()}`,
      thread_id: targetThreadId,
      sender_name: senderName || 'Website Visitor',
      is_from_portal: true,
      content: text,
      attachment_name: attachment ? attachment.name : undefined,
      attachment_type: attachment ? attachment.type : undefined,
      attachment_url: attachment ? attachment.url : undefined,
      created_at: timestamp
    }

    let updatedThreads
    const cleanCustomerName = senderName ? senderName.replace(/\s*\(.*\)$/, '').trim() : null

    let autoReplyMessage = null
    if (thread) {
      updatedThreads = state.nexusThreads.map(t => t.id === targetThreadId ? {
        ...t,
        status: 'open',
        customer_name: cleanCustomerName || t.customer_name,
        customer_phone: extractedPhone || t.customer_phone,
        customer_email: extractedEmail || t.customer_email,
        last_message_at: timestamp,
        messages: sortChatMessages([...t.messages, newMessage])
      } : t)
      if (cleanCustomerName && thread.customer_name !== cleanCustomerName) {
        api.put(`/crm/support-threads/${targetThreadId}`, {
          customer_name: cleanCustomerName,
          customer_phone: extractedPhone || undefined,
          customer_email: extractedEmail || undefined,
          status: 'open'
        }).catch(() => {})
        supabase.from('crm_support_threads').update({
          customer_name: cleanCustomerName,
          customer_phone: extractedPhone || undefined,
          customer_email: extractedEmail || undefined,
          status: 'open',
          last_message_at: timestamp
        }).eq('id', targetThreadId).then(() => {}).catch(console.error)
      }
    } else {
      autoReplyMessage = {
        id: `m-auto-${Date.now() - 5000}`,
        thread_id: targetThreadId,
        sender_name: 'KnK Sales Concierge',
        is_from_portal: false,
        content: `Hello ${cleanCustomerName || 'Valued Client'}! Welcome to KnK Automotive. 🚘\n\nI am your AI Executive Sales Concierge. How may I assist you today? Please feel free to state your request — whether you are inquiring about a specific vehicle (SUV, Prado, V8, Sedan), booking a test drive at Nairobi HQ, checking bank asset financing options, or arranging a 30-day custom import!`,
        created_at: new Date(Date.now() - 5000).toISOString()
      }

      const newThread = {
        id: targetThreadId,
        customer_id: `cust-${targetThreadId.replace('th-live-', '')}`,
        customer_name: cleanCustomerName || 'Website Visitor',
        customer_phone: extractedPhone,
        customer_email: extractedEmail,
        subject: 'Live Website Chat Inquiry',
        priority: 'high',
        status: 'open',
        last_message_at: timestamp,
        ip_address: tel.ip_address || null,
        latitude: tel.latitude || null,
        longitude: tel.longitude || null,
        location_name: tel.location_name || null,
        browser: tel.browser || null,
        device: tel.device || null,
        os: tel.os || null,
        messages: sortChatMessages([newMessage, autoReplyMessage])
      }
      updatedThreads = [newThread, ...state.nexusThreads]
      try {
        await Promise.allSettled([
          api.post('/crm/support-threads', newThread),
          supabase.from('crm_support_threads').upsert({
            id: newThread.id,
            customer_id: newThread.customer_id,
            customer_name: newThread.customer_name,
            customer_phone: newThread.customer_phone,
            customer_email: newThread.customer_email,
            subject: newThread.subject,
            priority: newThread.priority,
            status: newThread.status,
            last_message_at: newThread.last_message_at,
            ip_address: newThread.ip_address,
            latitude: newThread.latitude,
            longitude: newThread.longitude,
            location_name: newThread.location_name,
            browser: newThread.browser,
            device: newThread.device,
            os: newThread.os
          }, { onConflict: 'id' })
        ])
      } catch (err) {
        console.error('Failed to create support thread:', err)
      }
    }

    try {
      const posts = [
        api.post(`/crm/support-threads/${targetThreadId}/messages`, newMessage)
      ]
      if (autoReplyMessage) {
        posts.push(api.post(`/crm/support-threads/${targetThreadId}/messages`, autoReplyMessage))
      }
      await Promise.allSettled([
        ...posts,
        supabase.from('crm_support_messages').upsert(
          autoReplyMessage ? [newMessage, autoReplyMessage] : [newMessage],
          { onConflict: 'id' }
        )
      ])
      setTimeout(() => get().syncSupportThreads(), 2500)
      setTimeout(() => get().syncSupportThreads(), 5000)
    } catch { /* ignore */ }

    set({ nexusThreads: updatedThreads })
  },

  resolveNexusThread: (threadId) => {
    const updatedThreads = get().nexusThreads.map(t => t.id === threadId ? { ...t, status: 'resolved' } : t)
    set({ nexusThreads: updatedThreads })
    api.put(`/crm/support-threads/${threadId}`, { status: 'resolved' }).catch(() => {})
    supabase.from('crm_support_threads').update({ status: 'resolved' }).eq('id', threadId).then().catch(console.error)
  },

  toggleAIForThread: (threadId) => {
    const thread = get().nexusThreads.find(t => t.id === threadId)
    if (!thread) return
    const nextDisabled = !thread.ai_disabled
    const updatedThreads = get().nexusThreads.map(t => t.id === threadId ? { ...t, ai_disabled: nextDisabled } : t)
    set({ nexusThreads: updatedThreads })
    api.put(`/crm/support-threads/${threadId}`, { ai_disabled: nextDisabled }).catch(() => {})
    supabase.from('crm_support_threads').update({ ai_disabled: nextDisabled }).eq('id', threadId).then().catch(console.error)
  },

  // --- Lead Sources Mutations ---
  toggleLeadSource: (id) => {
    const src = get().leadSources.find(s => s.id === id)
    const nextState = !src?.is_active
    set(state => ({
      leadSources: state.leadSources.map(s => s.id === id ? { ...s, is_active: nextState } : s)
    }))
    api.put(`/crm/lead-sources/${id}`, { is_active: nextState }).catch(() => {})
    supabase.from('crm_lead_sources').update({ is_active: nextState }).eq('id', id).then().catch(console.error)
  },

  addLeadSource: (src) => {
    const newSrc = { id: `src-${Date.now()}`, is_active: true, ...src }
    set(state => ({ leadSources: [...state.leadSources, newSrc] }))
    api.post('/crm/lead-sources', newSrc).catch(() => {})
    supabase.from('crm_lead_sources').upsert(newSrc, { onConflict: 'id' }).then().catch(console.error)
  },

  // --- Theme Engine State & Action ---
  adminTheme: 'dark',
  toggleAdminTheme: () => set(state => ({
    adminTheme: state.adminTheme === 'dark' ? 'light' : 'dark'
  })),

  // --- Communication Log Mutation ---
  addCommunicationLog: (log) => {
    const newLog = {
      id: `log-${Date.now()}`,
      is_archived: false,
      log_date: log.log_date || `${new Date().toISOString().split('T')[0]} 14:00`,
      ...log
    }
    set(state => ({ communicationLogs: [newLog, ...state.communicationLogs] }))
    api.post('/crm/activity-logs', newLog).catch(() => {})
    supabase.from('crm_activity_logs').upsert(newLog, { onConflict: 'id' }).then().catch(console.error)
  },

  updateCommunicationLog: (logId, updates) => {
    set(state => ({ communicationLogs: state.communicationLogs.map(l => l.id === logId ? { ...l, ...updates } : l) }))
    api.put(`/crm/activity-logs/${logId}`, updates).catch(() => {})
    supabase.from('crm_activity_logs').update(updates).eq('id', logId).then().catch(console.error)
  },

  archiveCommunicationLog: (logId) => {
    set(state => ({ communicationLogs: state.communicationLogs.map(l => l.id === logId ? { ...l, is_archived: true } : l) }))
    api.put(`/crm/activity-logs/${logId}`, { is_archived: true }).catch(() => {})
    supabase.from('crm_activity_logs').update({ is_archived: true }).eq('id', logId).then().catch(console.error)
  },

  restoreCommunicationLog: (logId) => {
    set(state => ({ communicationLogs: state.communicationLogs.map(l => l.id === logId ? { ...l, is_archived: false } : l) }))
    api.put(`/crm/activity-logs/${logId}`, { is_archived: false }).catch(() => {})
    supabase.from('crm_activity_logs').update({ is_archived: false }).eq('id', logId).then().catch(console.error)
  },

  deleteCommunicationLog: (logId) => {
    set(state => ({ communicationLogs: state.communicationLogs.filter(l => l.id !== logId) }))
    api.delete(`/crm/activity-logs/${logId}`).catch(() => {})
    supabase.from('crm_activity_logs').delete().eq('id', logId).then().catch(console.error)
  },

  // --- SLA & Response Speed Actions ---
  markLeadResponded: (leadId) => {
    const now = new Date().toISOString()
    set(state => ({
      leads: state.leads.map(l => l.id === leadId ? { ...l, score_last_calculated_at: now, is_responded: true } : l)
    }))
    api.put(`/crm/leads/${leadId}`, { score_last_calculated_at: now, is_responded: true }).catch(() => {})
    supabase.from('crm_leads').update({ score_last_calculated_at: now, is_responded: true }).eq('id', leadId).then().catch(console.error)
  },

  updateChannelSLATarget: (key, newTargetMin) => {
    const nextChannels = get().channelSLAs.map(c => c.key === key ? { ...c, target_min: Number(newTargetMin) } : c)
    set({ channelSLAs: nextChannels })
    api.put('/crm/sla-channels', nextChannels).catch(() => {})
    supabase.from('crm_sla_channels').upsert({ key, target_min: Number(newTargetMin) }, { onConflict: 'key' }).then().catch(console.error)
  },

  // --- AI Concierge & API Settings Actions ---
  aiSettings: {
    AI_PROVIDER_DEFAULT: 'gemini-2.5-flash',
    AI_SYSTEM_PROMPT: '',
    AI_TEMPERATURE: 0.7,
    AI_MAX_TOKENS: 1500,
    AI_AUTO_REPLY_GLOBAL: true,
    has_gemini_key: false,
    has_openai_key: false,
    gemini_key_masked: '',
    openai_key_masked: '',
    gemini_source: 'none',
    openai_source: 'none'
  },

  fetchAISettings: async () => {
    try {
      const data = await api.get('/crm/ai-settings')
      if (data) set({ aiSettings: data })
      return data
    } catch (err) {
      console.warn('⚠️ Could not fetch AI settings:', err)
      return null
    }
  },

  saveAISettings: async (newSettings) => {
    try {
      const res = await api.put('/crm/ai-settings', newSettings)
      await get().fetchAISettings()
      return res
    } catch (err) {
      console.error('Failed to save AI settings:', err)
      throw err
    }
  },

  testAIKey: async (provider, apiKey, modelPref) => {
    try {
      const res = await api.post('/crm/ai-settings/test', { provider, apiKey, modelPref })
      return res
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message }
    }
  }
}))

