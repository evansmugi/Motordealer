'use strict';

/**
 * Live Chat Dispatch Engine
 * Real-time handling of chat messages sent via storefront ClientChatWidget.
 * Automatically creates/updates CrmChatLead and CrmSupportThread, broadcasting updates to NexusSupportCenter.
 */

module.exports = {
  async dispatchMessage(ctx) {
    try {
      const {
        name,
        email,
        phone,
        message,
        threadId,
        pageUrl,
        userAgent,
        ipAddress
      } = ctx.request.body;

      if (!message) {
        ctx.status = 400;
        return ctx.body = { error: 'Message content is required' };
      }

      let thread;

      // Find or create Support Thread
      if (threadId) {
        thread = await strapi.entityService.findOne('api::crm-support-thread.crm-support-thread', threadId);
      }

      if (!thread) {
        thread = await strapi.entityService.create('api::crm-support-thread.crm-support-thread', {
          data: {
            customer_name: name || 'Anonymous Visitor',
            customer_email: email || '',
            customer_phone: phone || '',
            subject: `Live Storefront Chat (${name || 'Guest'})`,
            priority: 'normal',
            currentStatus: 'open',
            last_message_at: new Date().toISOString(),
            ip_address: ipAddress || ctx.ip,
            publishedAt: new Date().toISOString()
          }
        });

        // Also capture or update CRM Chat Lead
        await strapi.entityService.create('api::crm-chat-lead.crm-chat-lead', {
          data: {
            name: name || 'Storefront Visitor',
            email: email || '',
            phone: phone || '',
            source: 'Live Chat Widget',
            notes: `Initial Inquiry: ${message}`,
            currentStatus: 'new',
            conversion_probability: 40,
            intent_score: 65,
            intent_tier: 'HIGH',
            ip_address: ipAddress || ctx.ip,
            page_url: pageUrl || '',
            user_agent: userAgent || '',
            captured_at: new Date().toISOString(),
            publishedAt: new Date().toISOString()
          }
        });
      }

      // Add support message to thread
      const chatMessage = await strapi.entityService.create('api::crm-support-message.crm-support-message', {
        data: {
          thread_id: String(thread.id),
          sender_name: name || 'Client',
          is_from_portal: false,
          content: message,
          sent_at: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      });

      // Update thread last message timestamp
      await strapi.entityService.update('api::crm-support-thread.crm-support-thread', thread.id, {
        data: {
          last_message_at: new Date().toISOString(),
          currentStatus: 'open'
        }
      });

      ctx.body = {
        success: true,
        threadId: thread.id,
        message: chatMessage
      };
    } catch (err) {
      console.error('[LiveChatDispatch] Error processing chat message:', err);
      ctx.status = 500;
      ctx.body = { error: 'Internal Server Error', message: err.message };
    }
  }
};
