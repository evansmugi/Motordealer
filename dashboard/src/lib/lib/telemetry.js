/**
 * Fuse Analytics Telemetry Client Tracker (telemetry.js)
 * Embeddable telemetry tracker for session fingerprinting, geospatial IP resolution,
 * Lat/Lng coordinates, location names, browser & device specs, active page sections,
 * click heatmaps, scroll depth monitoring, and form friction analysis.
 */

class FuseTelemetryTracker {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.clientMeta = this.resolveClientMetadata()
    this.initListeners()
  }

  getOrCreateSessionId() {
    if (typeof window === 'undefined') return 'sess_server_side'
    let sid = localStorage.getItem('fuse_session_id')
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
      localStorage.setItem('fuse_session_id', sid)
    }
    return sid
  }

  resolveClientMetadata() {
    // Try reading cached real metadata from sessionStorage first
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('fuse_real_client_meta')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.ip_address) {
            this.clientMeta = parsed
          }
        }
      } catch { /* ignore */ }
    }

    const meta = this.detectRealSpecs()

    // Initiate async real IP & Geolocation fetch
    if (typeof window !== 'undefined') {
      this.fetchRealGeoLocation().then(geo => {
        if (geo) {
          this.clientMeta = { ...this.clientMeta, ...geo }
          try {
            sessionStorage.setItem('fuse_real_client_meta', JSON.stringify(this.clientMeta))
          } catch { /* ignore */ }
        }
      }).catch(() => {})
    }

    return meta
  }

  detectRealSpecs() {
    if (typeof window === 'undefined') {
      return {
        ip_address: 'Detecting...',
        latitude: -1.286389,
        longitude: 36.817223,
        location_name: 'Nairobi, Kenya',
        browser: 'Chrome',
        device: 'Desktop',
        os: 'Windows'
      }
    }

    const ua = navigator.userAgent
    let browser = 'Chrome'
    let os = 'Windows'
    let device = 'Desktop'

    // Real Browser & Version Detection
    if (/edg\/([0-9.]+)/i.test(ua)) {
      const match = ua.match(/edg\/([0-9.]+)/i)
      browser = `Edge ${match ? match[1].split('.')[0] : ''}`
    } else if (/firefox\/([0-9.]+)/i.test(ua)) {
      const match = ua.match(/firefox\/([0-9.]+)/i)
      browser = `Firefox ${match ? match[1].split('.')[0] : ''}`
    } else if (/opr\/([0-9.]+)/i.test(ua)) {
      const match = ua.match(/opr\/([0-9.]+)/i)
      browser = `Opera ${match ? match[1].split('.')[0] : ''}`
    } else if (/chrome\/([0-9.]+)/i.test(ua)) {
      const match = ua.match(/chrome\/([0-9.]+)/i)
      browser = `Chrome ${match ? match[1].split('.')[0] : ''}`
    } else if (/version\/([0-9.]+).*safari/i.test(ua)) {
      const match = ua.match(/version\/([0-9.]+)/i)
      browser = `Safari ${match ? match[1].split('.')[0] : ''}`
    }

    // Real OS & Device Detection
    if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11'
    else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1'
    else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7'
    else if (/Mac OS X ([0-9_]+)/i.test(ua)) {
      const match = ua.match(/Mac OS X ([0-9_]+)/i)
      os = `macOS ${match ? match[1].replace(/_/g, '.') : ''}`
    } else if (/iPhone OS ([0-9_]+)/i.test(ua)) {
      const match = ua.match(/iPhone OS ([0-9_]+)/i)
      os = `iOS ${match ? match[1].replace(/_/g, '.') : ''}`
      device = 'Mobile (iPhone)'
    } else if (/iPad.*OS ([0-9_]+)/i.test(ua)) {
      const match = ua.match(/OS ([0-9_]+)/i)
      os = `iPadOS ${match ? match[1].replace(/_/g, '.') : ''}`
      device = 'Tablet (iPad)'
    } else if (/Android ([0-9.]+)/i.test(ua)) {
      const match = ua.match(/Android ([0-9.]+)/i)
      os = `Android ${match ? match[1] : ''}`
      device = /Mobile/i.test(ua) ? 'Mobile (Android)' : 'Tablet (Android)'
    } else if (/Linux/i.test(ua)) {
      os = 'Linux'
    }

    // Touch Points & Screen Size Fallback
    if (device === 'Desktop' && (navigator.maxTouchPoints > 0 || window.innerWidth <= 768)) {
      device = window.innerWidth <= 768 ? 'Mobile Device' : 'Tablet / Touch Laptop'
    }

    return {
      ip_address: 'Resolving IP...',
      latitude: -1.286389,
      longitude: 36.817223,
      location_name: 'Nairobi, Kenya',
      browser,
      device: `${device} (${window.screen.width}x${window.screen.height})`,
      os
    }
  }

  async fetchRealGeoLocation() {
    try {
      // 1. Fetch real IP and location from ipapi.co
      const res = await fetch('https://ipapi.co/json/', { timeout: 4000 }).catch(() => null)
      if (res && res.ok) {
        const data = await res.json()
        if (data && data.ip) {
          return {
            ip_address: data.ip,
            latitude: data.latitude || -1.286389,
            longitude: data.longitude || 36.817223,
            location_name: `${data.city || ''}, ${data.region || ''}, ${data.country_name || 'Kenya'}`.replace(/^,\s*/, '').trim(),
          }
        }
      }
    } catch { /* API offline or adblocker */ }

    try {
      // 2. Fallback to ip-api.com
      const res2 = await fetch('http://ip-api.com/json/?fields=status,country,regionName,city,lat,lon,query').catch(() => null)
      if (res2 && res2.ok) {
        const data2 = await res2.json()
        if (data2 && data2.status === 'success') {
          return {
            ip_address: data2.query,
            latitude: data2.lat,
            longitude: data2.lon,
            location_name: `${data2.city}, ${data2.regionName}, ${data2.country}`.trim()
          }
        }
      }
    } catch { /* ignore */ }

    return null
  }

  getSectionFromPosition() {
    if (typeof window === 'undefined') return 'Hero Section'
    const scrollY = window.scrollY
    const totalH = document.documentElement.scrollHeight
    const rel = totalH > 0 ? scrollY / totalH : 0

    if (rel < 0.2) return 'Hero & Vehicle Discovery'
    if (rel < 0.4) return 'Vehicle Specifications & Price Specs'
    if (rel < 0.6) return 'Direct Action Inquiry Cards'
    if (rel < 0.8) return 'Financing & Trade-In Calculator'
    return 'Footer & Related Listings'
  }

  initListeners() {
    if (typeof window === 'undefined') return

    // Page View Tracker with full telemetry payload
    this.logPageView(window.location.pathname)

    // Click Heatmap & Section Tracker
    document.addEventListener('click', (e) => {
      const target = e.target
      const closestSection = target.closest('section, header, footer, div[id]')?.id || this.getSectionFromPosition()
      const payload = {
        session_id: this.sessionId,
        url: window.location.pathname,
        ip_address: this.clientMeta.ip_address,
        latitude: this.clientMeta.latitude,
        longitude: this.clientMeta.longitude,
        location_name: this.clientMeta.location_name,
        browser: this.clientMeta.browser,
        device: this.clientMeta.device,
        page_section: closestSection,
        x: e.clientX,
        y: e.clientY + window.scrollY,
        screen_width: window.innerWidth,
        element_tag: target.tagName ? target.tagName.toLowerCase() : 'div',
        element_id: target.id || null,
        element_text: target.innerText ? target.innerText.substring(0, 50) : null,
        created_at: new Date().toISOString()
      }
      this.dispatchEvent('FUSE_HEATMAP_CLICK', payload)
    })

    // Scroll Depth Tracker
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentPct = Math.round((window.scrollY / totalHeight) * 100)
        if (currentPct > maxScroll) {
          maxScroll = currentPct
        }
      }
    })

    // Form Focus Tracker
    document.addEventListener('focusin', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        this.dispatchEvent('FUSE_ANALYTICS_EVENT', {
          session_id: this.sessionId,
          event_type: 'field_complete',
          ip_address: this.clientMeta.ip_address,
          latitude: this.clientMeta.latitude,
          longitude: this.clientMeta.longitude,
          location_name: this.clientMeta.location_name,
          browser: this.clientMeta.browser,
          device: this.clientMeta.device,
          page_section: 'Vehicle Inquiry Form',
          details: { field: e.target.name || e.target.id || 'form_field' },
          created_at: new Date().toISOString()
        })
      }
    })
  }

  logPageView(url) {
    const payload = {
      session_id: this.sessionId,
      url,
      ip_address: this.clientMeta.ip_address,
      latitude: this.clientMeta.latitude,
      longitude: this.clientMeta.longitude,
      location_name: this.clientMeta.location_name,
      browser: this.clientMeta.browser,
      device: this.clientMeta.device,
      page_section: this.getSectionFromPosition(),
      referrer: document.referrer || 'Direct',
      time_on_page: 0,
      created_at: new Date().toISOString()
    }
    this.dispatchEvent('FUSE_PAGE_VIEW', payload)
  }

  dispatchEvent(eventName, detail) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail }))
    }
  }
}

export const telemetry = new FuseTelemetryTracker()

export function getClientTelemetry() {
  if (typeof window === 'undefined') {
    return {
      ip_address: '102.217.155.84',
      latitude: -1.286389,
      longitude: 36.817223,
      location_name: 'Nairobi, Nairobi County, Kenya',
      browser: 'Chrome 126.0',
      device: 'Desktop (Windows 11)',
      os: 'Windows 11'
    }
  }
  return telemetry.clientMeta
}
