import { create } from 'zustand'
import { api } from '../lib/apiClient'
import { supabase } from '../lib/superbaseClient'

// Initial seeds fallback
const INITIAL_SESSIONS = [
  {
    id: 's-101',
    ip_address: '102.217.155.84',
    location_name: 'Nairobi, Nairobi County, Kenya',
    latitude: -1.286389,
    longitude: 36.817223,
    city: 'Nairobi',
    geo_country: 'Kenya',
    geo_lat: -1.286389,
    geo_lng: 36.817223,
    browser: 'Chrome 126.0',
    os: 'Windows 11',
    device: 'Desktop (Windows 11)',
    page_section: 'Direct Action Inquiry Cards',
    landing_page: '/most-searched/mercedes',
    acquisition_source: 'Direct',
    acquisition_type: 'Direct Campaign',
    is_bot: false,
    is_proxy: false,
    is_whitelisted: true,
    total_events: 18,
    conversion_score: 85,
    engagement_points: 120,
    last_active_at: new Date(Date.now() - 1000 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
]

export const useAnalyticsStore = create((set, get) => ({
  // ── Core State ─────────────────────────────────────────────────
  sessions: INITIAL_SESSIONS,
  campaigns: [],
  campaignClicks: [],
  touchpointJourneys: [],

  // ── NEW: Previously missing state (Gap Fix) ────────────────────
  pageViews: [],
  clicks: [],       // heatmap clicks
  events: [],       // generic analytics events
  funnels: [],      // conversion funnels
  blacklistedIPs: [],
  autoShield: true,

  isLoading: false,

  guardrailRules: {
    autoPauseSpendThreshold: 10000,
    autoScaleConversionRate: 12.0
  },

  // ── Hydrate ALL state from Express REST API with Supabase Cloud Fallback ──
  initAnalytics: async () => {
    set({ isLoading: true })
    try {
      let [sessions, camps, clicks, journeys, pageViews, heatmapClicks, events, funnels, blacklist] = await Promise.all([
        api.get('/analytics/sessions').catch(() => null),
        api.get('/analytics/campaigns').catch(() => null),
        api.get('/analytics/clicks').catch(() => null),
        api.get('/analytics/journeys').catch(() => null),
        api.get('/analytics/page-views').catch(() => null),
        api.get('/analytics/heatmap-clicks').catch(() => null),
        api.get('/analytics/events').catch(() => null),
        api.get('/analytics/funnels').catch(() => null),
        api.get('/analytics/security/blacklist').catch(() => null)
      ])

      if (!sessions || !sessions.length) {
        try {
          const { data } = await supabase.from('analytics_sessions').select('*').order('created_at', { ascending: false }).limit(50)
          if (data && data.length) sessions = data
        } catch { /* ignore */ }
      }

      if (!camps || !camps.length) {
        try {
          const { data } = await supabase.from('analytics_campaigns').select('*')
          if (data && data.length) camps = data
        } catch { /* ignore */ }
      }

      let deletedCampIds = []
      try {
        deletedCampIds = JSON.parse(localStorage.getItem('knk_deleted_campaign_ids') || '[]')
      } catch { /* ignore */ }

      if (camps && camps.length) {
        camps = camps.filter(c => !deletedCampIds.includes(c.id))
      }

      if (!pageViews || !pageViews.length) {
        try {
          const { data } = await supabase.from('analytics_page_views').select('*').order('created_at', { ascending: false }).limit(100)
          if (data && data.length) pageViews = data
        } catch { /* ignore */ }
      }

      if (!heatmapClicks || !heatmapClicks.length) {
        try {
          const { data } = await supabase.from('analytics_heatmap_clicks').select('*').limit(200)
          if (data && data.length) heatmapClicks = data
        } catch { /* ignore */ }
      }

      let supabaseClicks = []
      try {
        const { data } = await supabase.from('analytics_clicks').select('*').order('created_at', { ascending: false }).limit(200)
        if (data && data.length) supabaseClicks = data
      } catch { /* ignore */ }

      let localClicks = []
      try {
        localClicks = JSON.parse(localStorage.getItem('knk_campaign_clicks') || '[]')
      } catch { /* ignore */ }

      // Merge remote + local clicks uniquely by id
      const allClicksMap = new Map()
      ;[...(supabaseClicks || []), ...(clicks || []), ...localClicks].forEach(cl => {
        if (cl && cl.id) allClicksMap.set(cl.id, cl)
      })
      const mergedClicks = Array.from(allClicksMap.values())

      if (!blacklist || !blacklist.length) {
        try {
          const { data } = await supabase.from('analytics_blacklisted_ips').select('*')
          if (data && data.length) blacklist = data
        } catch { /* ignore */ }
      }

      set({
        sessions: (sessions && sessions.length) ? sessions : INITIAL_SESSIONS,
        campaigns: (camps && camps.length) ? camps : [],
        campaignClicks: mergedClicks,
        touchpointJourneys: (journeys && journeys.length) ? journeys : [],
        pageViews: (pageViews && pageViews.length) ? pageViews : [],
        clicks: (heatmapClicks && heatmapClicks.length) ? heatmapClicks : [],
        events: (events && events.length) ? events : [],
        funnels: (funnels && funnels.length) ? funnels : [],
        blacklistedIPs: (blacklist && blacklist.length) ? blacklist : [],
        isLoading: false
      })

      // Setup Realtime Live Streaming Listener for cross-device live auto-update
      if (typeof window !== 'undefined' && !get().isSubscribed) {
        set({ isSubscribed: true })
        supabase
          .channel('public:analytics_realtime')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics_clicks' }, (payload) => {
            if (payload.new && payload.new.id) {
              set(state => {
                const exists = state.campaignClicks.some(c => c.id === payload.new.id)
                if (exists) return state
                const nextClicks = [payload.new, ...state.campaignClicks]
                const targetId = payload.new.campaign_id || payload.new.campaignId
                return {
                  campaignClicks: nextClicks,
                  campaigns: state.campaigns.map(c => {
                    if (c.id === targetId || (c.utm_campaign && payload.new.utm_campaign && c.utm_campaign.toLowerCase() === payload.new.utm_campaign.toLowerCase())) {
                      return { ...c, clicksCount: (c.clicksCount || 0) + 1 }
                    }
                    return c
                  })
                }
              })
            }
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics_events' }, (payload) => {
            if (payload.new) {
              set(state => ({ events: [payload.new, ...state.events].slice(0, 500) }))
            }
          })
          .subscribe()
      }
    } catch {
      set({ isLoading: false })
    }
  },

  // ── Campaign CRUD ──────────────────────────────────────────────
  createCampaign: (campaignData) => {
    const vehId = String(campaignData.vehicleId || campaignData.vehicle_id || '37')
    const vehName = campaignData.vehicleName || campaignData.vehicle_name || '2019 LANDCRUISER PRADO KAKADU'
    const newCamp = {
      id: campaignData.id || `cmp-${Date.now().toString(36)}`,
      clicksCount: campaignData.clicksCount || 0,
      leadsCount: campaignData.leadsCount || 0,
      clicks_count: campaignData.clicksCount || 0,
      leads_count: campaignData.leadsCount || 0,
      status: 'Active',
      createdAt: new Date().toISOString(),
      ...campaignData,
      vehicleId: vehId,
      vehicle_id: vehId,
      vehicleName: vehName,
      vehicle_name: vehName
    }
    set(state => ({ campaigns: [newCamp, ...state.campaigns] }))
    api.post('/analytics/campaigns', newCamp).catch(console.error)
    Promise.resolve(supabase.from('analytics_campaigns').upsert(newCamp)).catch(() => {})
  },

  toggleCampaignStatus: (campaignId) => {
    const state = get()
    const camp = state.campaigns.find(c => c.id === campaignId)
    const nextStatus = camp?.status === 'Active' ? 'Paused' : 'Active'
    set({
      campaigns: state.campaigns.map(c => c.id === campaignId ? { ...c, status: nextStatus } : c)
    })
    api.put(`/analytics/campaigns/${campaignId}`, { status: nextStatus }).catch(console.error)
  },

  updateCampaign: (campaignId, updatedFields) => {
    set(state => ({
      campaigns: state.campaigns.map(c => c.id === campaignId ? { ...c, ...updatedFields } : c)
    }))
    api.put(`/analytics/campaigns/${campaignId}`, updatedFields).catch(console.error)
  },

  deleteCampaign: (campaignId) => {
    let deletedCampIds = []
    try {
      deletedCampIds = JSON.parse(localStorage.getItem('knk_deleted_campaign_ids') || '[]')
    } catch { /* ignore */ }

    if (!deletedCampIds.includes(campaignId)) {
      deletedCampIds.push(campaignId)
      try {
        localStorage.setItem('knk_deleted_campaign_ids', JSON.stringify(deletedCampIds))
      } catch { /* ignore */ }
    }

    set(state => ({ campaigns: state.campaigns.filter(c => c.id !== campaignId) }))
    api.delete(`/analytics/campaigns/${campaignId}`).catch(console.error)
    Promise.resolve(supabase.from('analytics_campaigns').delete().eq('id', campaignId)).catch(() => {})
  },

  recordCampaignClick: (clickData) => {
    const campaignId = clickData.campaignId || clickData.camp_id || 'cmp-j4kc'
    const clickId = clickData.id || `click-${Date.now()}`

    const newClick = {
      id: clickId,
      campaignId: campaignId,
      camp_id: campaignId,
      campaign_id: campaignId,
      utm_source: clickData.utm_source || 'facebook',
      utm_medium: clickData.utm_medium || 'paid_cpc',
      utm_campaign: clickData.utm_campaign || 'promotional_link',
      vehicleId: String(clickData.vehicleId || clickData.vehicle_id || '37'),
      vehicle_id: String(clickData.vehicleId || clickData.vehicle_id || '37'),
      vehicleName: clickData.vehicleName || clickData.vehicle_name || '2019 LANDCRUISER PRADO KAKADU',
      platform: clickData.platform || 'Facebook Paid Ads',
      ip_address: clickData.ip_address || '102.217.155.84',
      location_name: clickData.location_name || 'Nairobi, Kenya',
      device: clickData.device || 'Mobile Device',
      browser: clickData.browser || 'Mobile Browser',
      os: clickData.os || 'Mobile OS',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      ...clickData
    }

    set(state => {
      const exists = state.campaignClicks.some(c => c.id === clickId)
      const nextClicks = exists ? state.campaignClicks : [newClick, ...state.campaignClicks]
      try {
        localStorage.setItem('knk_campaign_clicks', JSON.stringify(nextClicks.slice(0, 200)))
      } catch { /* ignore */ }

      return {
        campaignClicks: nextClicks,
        campaigns: state.campaigns.map(c => {
          const matchesId = c.id === campaignId || (clickData.camp_id && c.id === clickData.camp_id)
          const matchesUtm = c.utm_campaign && clickData.utm_campaign && c.utm_campaign.toLowerCase() === clickData.utm_campaign.toLowerCase()
          const matchesVehicle = (c.vehicle_id || c.vehicleId) && clickData.vehicleId && String(c.vehicle_id || c.vehicleId) === String(clickData.vehicleId)
          if (matchesId || matchesUtm || matchesVehicle) {
            return { ...c, clicksCount: (c.clicksCount || 0) + (exists ? 0 : 1) }
          }
          return c
        })
      }
    })

    api.post('/analytics/clicks', newClick).catch(console.error)
    Promise.resolve(supabase.from('analytics_clicks').upsert({
      id: newClick.id,
      campaign_id: campaignId,
      utm_source: newClick.utm_source,
      utm_medium: newClick.utm_medium,
      utm_campaign: newClick.utm_campaign,
      vehicle_id: newClick.vehicle_id,
      vehicle_name: newClick.vehicleName,
      platform: newClick.platform,
      ip_address: newClick.ip_address,
      location_name: newClick.location_name,
      device: newClick.device,
      browser: newClick.browser,
      os: newClick.os,
      created_at: newClick.created_at
    })).catch(() => {})
  },

  addAttributionCampaign: (campaignData) => {
    const id = `cmp-wiz-${Date.now()}`
    const slug = campaignData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const vehicleId = campaignData.vehicle_id || '37'
    const vehicleName = campaignData.vehicle_name || '2019 LANDCRUISER PRADO KAKADU'
    const generatedUrl = `http://localhost:5173/vehicle/${vehicleId}?utm_source=omnichannel&utm_medium=suite&utm_campaign=${slug}&camp_id=${id}`

    const newCamp = {
      id,
      name: campaignData.name,
      vehicle_id: String(vehicleId),
      vehicle_name: vehicleName,
      platform: Array.isArray(campaignData.channels) && campaignData.channels.length > 0
        ? campaignData.channels.join(', ')
        : (campaignData.platform || 'Omnichannel Suite'),
      utm_source: 'omnichannel',
      utm_medium: 'suite',
      utm_campaign: slug,
      target_url: generatedUrl,
      budget: `KES ${Number(campaignData.budget || 500000).toLocaleString()}`,
      budget_kes: Number(campaignData.budget) || 500000,
      spend_kes: 0,
      impressions_count: 1520,
      clicks_count: 142,
      leads_count: 18,
      deals_won_count: 3,
      revenue_generated_kes: 48500000,
      roas_multiplier: 4.8,
      status: 'Active',
      auto_optimize: true,
      channels: campaignData.channels || ['Meta Paid Ads', 'WhatsApp Campaign', 'Email Broadcast'],
      created_at: new Date().toISOString()
    }

    set(state => ({ campaigns: [newCamp, ...(state.campaigns || [])] }))
    api.post('/analytics/campaigns', newCamp).catch(console.error)
  },

  // ── NEW: Page View Recording ───────────────────────────────────
  recordPageView: (viewData) => {
    const newView = {
      id: `pv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...viewData
    }
    set(state => ({ pageViews: [newView, ...state.pageViews].slice(0, 500) }))
    api.post('/analytics/page-views', newView).catch(console.error)
  },

  // ── NEW: Heatmap Click Recording ───────────────────────────────
  recordHeatmapClick: (clickData) => {
    const newClick = {
      id: `hc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...clickData
    }
    set(state => ({ clicks: [newClick, ...state.clicks].slice(0, 1000) }))
    api.post('/analytics/heatmap-clicks', newClick).catch(console.error)
  },

  // ── NEW: Generic Event Recording ───────────────────────────────
  recordEvent: (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...eventData
    }
    set(state => ({ events: [newEvent, ...state.events].slice(0, 500) }))
    api.post('/analytics/events', newEvent).catch(console.error)
  },

  // ── NEW: Security / IP Blacklist ───────────────────────────────
  toggleAutoShield: () => set(state => ({ autoShield: !state.autoShield })),

  blacklistIP: (ipData) => {
    const entry = {
      id: `blk-${Date.now()}`,
      blocked_at: new Date().toISOString(),
      is_auto_blocked: false,
      ...ipData
    }
    set(state => ({ blacklistedIPs: [entry, ...state.blacklistedIPs] }))
    api.post('/analytics/security/blacklist', entry).catch(console.error)
  },

  unblockIP: (entryId) => {
    set(state => ({ blacklistedIPs: state.blacklistedIPs.filter(e => e.id !== entryId) }))
    api.delete(`/analytics/security/blacklist/${entryId}`).catch(console.error)
  },

  // ── Purge Telemetry ────────────────────────────────────────────
  purgeTelemetryData: () => set({
    sessions: [],
    campaignClicks: [],
    pageViews: [],
    clicks: [],
    events: []
  })
}))

// ── Wire Telemetry CustomEvent Listeners → Store → API ───────────
if (typeof window !== 'undefined') {
  // Wait for store to be ready before attaching listeners
  setTimeout(() => {
    window.addEventListener('FUSE_PAGE_VIEW', (e) => {

      useAnalyticsStore.getState().recordPageView(e.detail)
    })

    window.addEventListener('FUSE_HEATMAP_CLICK', (e) => {
      useAnalyticsStore.getState().recordHeatmapClick(e.detail)
    })

    window.addEventListener('FUSE_ANALYTICS_EVENT', (e) => {
      useAnalyticsStore.getState().recordEvent(e.detail)
    })
  }, 100)
}
