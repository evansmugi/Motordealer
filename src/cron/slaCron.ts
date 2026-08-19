/**
 * Automated SLA Monitor Cron Task
 * Runs every 5 minutes. Evaluates crm_leads without representative contact within 15 minutes.
 * Increments breaches on CrmRepVelocity and generates SLA breach alerts.
 */

export async function runSlaCheck(strapi: any) {
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    // Find uncontacted new leads created more than 15 minutes ago
    const overdueLeads = await strapi.entityService.findMany('api::crm-lead.crm-lead', {
      filters: {
        currentStatus: 'new',
        createdAt: { $lt: fifteenMinsAgo }
      }
    });

    if (!overdueLeads || overdueLeads.length === 0) {
      return { checked: 0, breaches: 0 };
    }

    let breachCount = 0;

    for (const lead of overdueLeads) {
      breachCount++;

      // Update lead status to flagged/overdue notes
      await strapi.entityService.update('api::crm-lead.crm-lead', lead.id, {
        data: {
          notes: `[SLA BREACH ALERT] Contact overdue by 15+ minutes. ${lead.notes || ''}`.trim()
        }
      });

      // Increment breach count for assigned rep velocity
      if (lead.assigned_to) {
        const reps = await strapi.entityService.findMany('api::crm-rep-velocity.crm-rep-velocity', {
          filters: { name: lead.assigned_to }
        });

        if (reps && reps.length > 0) {
          const rep = reps[0];
          await strapi.entityService.update('api::crm-rep-velocity.crm-rep-velocity', rep.id, {
            data: {
              breaches: (rep.breaches || 0) + 1,
              compliance_percent: Math.max(0, (rep.compliance_percent || 100) - 2),
              currentStatus: 'SLA Warning'
            }
          });
        }
      }
    }

    // Update global SLA metric
    const metrics = await strapi.entityService.findMany('api::crm-sla-metric.crm-sla-metric');
    if (metrics && metrics.length > 0) {
      await strapi.entityService.update('api::crm-sla-metric.crm-sla-metric', metrics[0].id, {
        data: {
          breach_count: (metrics[0].breach_count || 0) + breachCount
        }
      });
    }

    console.log(`[SLA Cron] Evaluated ${overdueLeads.length} leads. ${breachCount} breaches processed.`);
    return { checked: overdueLeads.length, breaches: breachCount };
  } catch (err: any) {
    console.error('[SLA Cron] Error running SLA check:', err);
    return { error: err.message };
  }
}

export default { runSlaCheck };
