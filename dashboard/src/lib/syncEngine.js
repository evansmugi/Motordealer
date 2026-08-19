import api from './apiClient'

/**
 * Client-Side Library helper to interact with the project's Automated Sync Engine
 */

export async function fetchSyncStatus() {
  try {
    const { data } = await api.get('/sync/status')
    return data
  } catch (err) {
    console.error('Failed to fetch sync status:', err)
    return { status: 'error', error: err.message }
  }
}

export async function triggerManualSync() {
  try {
    const { data } = await api.post('/sync/trigger')
    return data
  } catch (err) {
    console.error('Failed to trigger manual sync:', err)
    return { status: 'error', error: err.message }
  }
}

export default {
  fetchSyncStatus,
  triggerManualSync
}
