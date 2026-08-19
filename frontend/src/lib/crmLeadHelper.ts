/**
 * Helper to feed incoming storefront modal submissions and chat entries directly into Strapi CRM Leads
 */

export interface CrmLeadPayload {
  name: string;
  phone?: string;
  email?: string;
  source: string;
  notes?: string;
  intentScore?: number;
  intentTier?: 'LOW' | 'MEDIUM' | 'HIGH' | 'HOT';
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
  } catch (err) {
    console.error('Failed to create CRM lead:', err);
  }
}
