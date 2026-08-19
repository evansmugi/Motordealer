/**
 * Live Chat Timestamp & Chronological Sorting Utilities
 */

export function normalizeIsoTimestamp(ts) {
  if (!ts) return ''
  let str = String(ts).trim()
  if (str.includes(' ') && !str.includes('T')) {
    str = str.replace(' ', 'T')
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) {
    str += ':00'
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(str) && !str.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(str)) {
    str += 'Z'
  }
  return str
}

export function getTimestampMs(ts, fallbackId) {
  if (ts) {
    const isoStr = normalizeIsoTimestamp(ts)
    const parsed = new Date(isoStr).getTime()
    if (!isNaN(parsed) && parsed > 0) return parsed
  }

  if (fallbackId && typeof fallbackId === 'string') {
    const match = fallbackId.match(/\d{10,13}/)
    if (match) {
      const num = Number(match[0])
      if (num > 1000000000000) return num
      if (num > 1000000000) return num * 1000
    }
  }

  return 0
}

export function formatChatTime(ts) {
  if (!ts) return ''
  try {
    const isoStr = normalizeIsoTimestamp(ts)
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return String(ts)

    const hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${formattedHours}:${formattedMinutes} ${ampm}`
  } catch {
    return String(ts)
  }
}

export function sortChatMessages(messages) {
  if (!Array.isArray(messages)) return []

  // Deduplicate by ID or identical content key
  const seenKeys = new Set()
  const uniqueMsgs = []

  for (const m of messages) {
    if (!m) continue
    const key = m.id || `${m.sender_name}-${m.content || m.message_text}-${m.created_at}`
    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      uniqueMsgs.push(m)
    }
  }

  return uniqueMsgs.sort((a, b) => {
    // Welcome / Initial Concierge greeting always sorts at the very top of the thread
    const isWelcomeA = (a.id && String(a.id).includes('m-auto')) || (a.content || a.message_text || '').includes('Welcome to KnK')
    const isWelcomeB = (b.id && String(b.id).includes('m-auto')) || (b.content || b.message_text || '').includes('Welcome to KnK')

    if (isWelcomeA && !isWelcomeB) return -1
    if (isWelcomeB && !isWelcomeA) return 1

    const timeA = getTimestampMs(a.created_at, a.id)
    const timeB = getTimestampMs(b.created_at, b.id)

    if (timeA !== timeB) {
      return timeA - timeB // Ascending: earliest message first, newest message last
    }

    // Tie-breaker 1: Client/Visitor message comes BEFORE Bot/Agent auto-reply sent at the same timestamp
    if (a.is_from_portal !== b.is_from_portal) {
      return a.is_from_portal ? -1 : 1
    }

    // Tie-breaker 2: Compare ID
    return String(a.id || '').localeCompare(String(b.id || ''))
  })
}
