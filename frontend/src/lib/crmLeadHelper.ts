/**
 * Helper to feed incoming storefront modal submissions and chat entries directly into Strapi CRM Leads
 * and broadcast real-time pop-up alerts to the Admin Dashboard
 */

export interface CrmLeadPayload {
  name: string;
  phone?: string;
  email?: string;
  source: string;
  notes?: string;
  intentScore?: number;
  intentTier?: 'LOW' | 'MEDIUM' | 'HIGH' | 'HOT';
  tradeVehicle?: string;
  targetVehicle?: string;
  expectedValue?: string;
}

export async function sendCrmLead(leadData: CrmLeadPayload) {
  try {
    const payload = {
      data: {
        name: leadData.name || 'VIP Storefront Prospect',
        phone: leadData.phone || '',
        email: leadData.email || '',
        source: leadData.source || 'Storefront Digital Matrix',
        currentStatus: 'new',
        intent_score: leadData.intentScore || 85,
        intent_tier: leadData.intentTier || 'HOT',
        notes: leadData.notes || `Inbound lead captured via ${leadData.source}`,
        publishedAt: new Date().toISOString()
      }
    };

    await fetch('http://localhost:1338/api/crm-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch((err) => console.warn('Strapi CRM lead endpoint warning:', err));

    // Broadcast real-time notifications to Admin Dashboard via BroadcastChannel & LocalStorage
    if (typeof window !== 'undefined') {
      const isTradeIn = leadData.source.includes('Trade-In');
      const eventPayload = {
        id: `event-${Date.now()}`,
        type: isTradeIn ? 'NEW_TRADE_IN_NOTIFICATION' : 'NEW_LEAD_NOTIFICATION',
        timestamp: new Date().toISOString(),
        tradeIn: isTradeIn ? {
          id: `trade-${Date.now()}`,
          client_name: leadData.name,
          client_phone: leadData.phone,
          trade_vehicle: leadData.tradeVehicle || leadData.notes || 'Current Vehicle',
          target_vehicle: leadData.targetVehicle || 'Target Vehicle',
          expected_value: leadData.expectedValue || '0',
          image_count: 1
        } : null,
        lead: {
          name: leadData.name,
          phone: leadData.phone,
          source: leadData.source,
          notes: leadData.notes,
          intentScore: leadData.intentScore || 85
        }
      };

      try {
        const channelName = isTradeIn ? 'knk_trade_in_notification_channel' : 'knk_lead_notification_channel';
        const bc = new BroadcastChannel(channelName);
        bc.postMessage(eventPayload);
        bc.close();
      } catch { /* ignore */ }

      try {
        const storageKey = isTradeIn ? 'knk_latest_trade_in_event' : 'knk_latest_lead_event';
        localStorage.setItem(storageKey, JSON.stringify(eventPayload));
      } catch { /* ignore */ }
    }
  } catch (err) {
    console.error('Failed to create CRM lead:', err);
  }
}
