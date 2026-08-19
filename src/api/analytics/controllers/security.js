'use strict';

/**
 * Analytics & Threat Security Controller
 * Evaluates IP threat scores based on rapid repeated hits, auto-populates AnalyticsBlacklistedIp,
 * and returns 403 Forbidden for blacklisted IPs.
 */

const ipHitTracker = new Map();

module.exports = {
  async evaluateRequest(ctx, next) {
    const clientIp = ctx.ip || ctx.request.ip || '127.0.0.1';

    try {
      // 1. Check if IP is in Strapi AnalyticsBlacklistedIp collection
      const blacklisted = await strapi.entityService.findMany('api::analytics-blacklisted-ip.analytics-blacklisted-ip', {
        filters: {
          ip_address: clientIp,
          is_active: true
        }
      });

      if (blacklisted && blacklisted.length > 0) {
        ctx.status = 403;
        ctx.body = {
          error: 'Forbidden',
          message: 'Access denied by KnK Security Shield. IP address has been blacklisted due to threat security policy.',
          ip: clientIp
        };
        return;
      }

      // 2. Track hit rate in sliding window
      const now = Date.now();
      const hits = ipHitTracker.get(clientIp) || [];
      const recentHits = hits.filter(timestamp => now - timestamp < 60000); // last 1 min
      recentHits.push(now);
      ipHitTracker.set(clientIp, recentHits);

      // If rapid hits exceed 120 per minute, auto-blacklist
      if (recentHits.length > 120) {
        await strapi.entityService.create('api::analytics-blacklisted-ip.analytics-blacklisted-ip', {
          data: {
            ip_address: clientIp,
            reason: 'Automated Rate Limit Breach (>120 req/min)',
            threat_score: 95,
            blocked_at: new Date().toISOString(),
            is_active: true,
            publishedAt: new Date().toISOString()
          }
        });

        ctx.status = 403;
        ctx.body = {
          error: 'Forbidden',
          message: 'High threat activity detected. IP automatically blacklisted.',
          ip: clientIp
        };
        return;
      }
    } catch (err) {
      console.error('[SecurityShield] Error checking IP status:', err);
    }

    if (next) {
      await next();
    }
  }
};
