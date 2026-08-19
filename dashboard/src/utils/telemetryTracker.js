import { api } from '../lib/apiClient'

/**
 * Ensures a persistent visitor identifier across sessions
 */
export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return 'visitor-server'
  let visitorId = localStorage.getItem('knk_visitor_id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
    localStorage.setItem('knk_visitor_id', visitorId)
  }
  return visitorId
}

/**
 * Tracks micro-conversion events to analytics backend for Lead Scoring
 */
export function trackTelemetryEvent(eventType, details = {}) {
  const visitorId = getOrCreateVisitorId()
  const payload = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    session_id: visitorId,
    event_type: eventType,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    details: {
      ...details,
      visitor_id: visitorId,
      timestamp: new Date().toISOString()
    },
    created_at: new Date().toISOString()
  }

  // Send to backend via REST API
  api.post('/analytics/events', payload).catch(() => {
    // Silent catch if offline or server fallback
  })

  return payload
}

/**
 * Specific helper shortcuts for key lead intent criteria
 */
export const LeadIntentTracker = {
  trackWhatsAppClick: (sourceLocation, vehicleName) => {
    return trackTelemetryEvent('WHATSAPP_CLICK', {
      source_location: sourceLocation,
      vehicle_name: vehicleName
    })
  },

  trackPhotoDownload: (vehicleId, vehicleName, photoUrl) => {
    return trackTelemetryEvent('PHOTO_DOWNLOAD', {
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
      photo_url: photoUrl
    })
  },

  trackTradeInPhotoUpload: (vehicleModel, photoCount) => {
    return trackTelemetryEvent('TRADEIN_PHOTO_UPLOAD', {
      vehicle_model: vehicleModel,
      photo_count: photoCount
    })
  },

  trackAppointmentBooked: (vehicleId, dateSlot) => {
    return trackTelemetryEvent('VIEWING_APPOINTMENT_BOOKED', {
      vehicle_id: vehicleId,
      date_slot: dateSlot
    })
  },

  trackBlogView: (articleSlug, articleCategory) => {
    return trackTelemetryEvent('BLOG_VIEW', {
      article_slug: articleSlug,
      category: articleCategory
    })
  }
}
