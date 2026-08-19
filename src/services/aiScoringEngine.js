'use strict';

/**
 * Predictive Lead Scoring Engine
 * Evaluates behavioral metrics to calculate an intent_score (0-100) and assigns an intent_tier:
 * - LOW: < 40
 * - MEDIUM: 40 - 69
 * - HIGH: 70 - 89
 * - HOT: 90+
 */

function calculateLeadScore(metrics = {}) {
  let score = 10; // Base score for any contact

  const {
    vehicle_views = 0,
    time_spent_seconds = 0,
    inquiry_modals_opened = 0,
    test_drive_requested = false,
    trade_in_calculated = false,
    finance_calculated = false,
    return_visits = 0
  } = metrics;

  // View count scoring
  score += Math.min(vehicle_views * 5, 25);

  // Dwell time scoring (1 point per 30 seconds up to 20 points)
  score += Math.min(Math.floor(time_spent_seconds / 30), 20);

  // Inquiry modal interaction
  score += inquiry_modals_opened * 10;

  // High-intent conversion actions
  if (test_drive_requested) score += 30;
  if (trade_in_calculated) score += 15;
  if (finance_calculated) score += 10;

  // Repeat visitors
  score += Math.min(return_visits * 5, 15);

  // Cap score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));

  let tier = 'LOW';
  if (finalScore >= 90) {
    tier = 'HOT';
  } else if (finalScore >= 70) {
    tier = 'HIGH';
  } else if (finalScore >= 40) {
    tier = 'MEDIUM';
  }

  return {
    intent_score: finalScore,
    intent_tier: tier,
    calculated_at: new Date().toISOString()
  };
}

module.exports = {
  calculateLeadScore,
  async updateLeadScore(strapi, leadId) {
    try {
      const lead = await strapi.entityService.findOne('api::crm-lead.crm-lead', leadId);
      if (!lead) return null;

      const metrics = lead.behavioral_metrics || {};
      const { intent_score, intent_tier, calculated_at } = calculateLeadScore(metrics);

      return await strapi.entityService.update('api::crm-lead.crm-lead', leadId, {
        data: {
          intent_score,
          intent_tier,
          score_last_calculated_at: calculated_at
        }
      });
    } catch (err) {
      console.error('Error in updateLeadScore:', err);
      return null;
    }
  }
};
