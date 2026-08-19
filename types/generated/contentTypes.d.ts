import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::permission'
    >;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON & Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordTokenExpiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAccessoryAccessory extends Struct.CollectionTypeSchema {
  collectionName: 'accessories';
  info: {
    description: 'Managed Accessory entity';
    displayName: 'Accessory';
    pluralName: 'accessories';
    singularName: 'accessory';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    image_url: Schema.Attribute.String;
    in_stock: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::accessory.accessory'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAnalyticsBlacklistedIpAnalyticsBlacklistedIp
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_blacklisted_ips';
  info: {
    description: 'Managed Analytics Blacklisted IP entity';
    displayName: 'Analytics Blacklisted IP';
    pluralName: 'analytics-blacklisted-ips';
    singularName: 'analytics-blacklisted-ip';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    blocked_at: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ip_address: Schema.Attribute.String & Schema.Attribute.Required;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-blacklisted-ip.analytics-blacklisted-ip'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    reason: Schema.Attribute.String;
    threat_score: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<80>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAnalyticsCampaignClickAnalyticsCampaignClick
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_campaign_clicks';
  info: {
    description: 'Managed Analytics Campaign Click entity';
    displayName: 'Analytics Campaign Click';
    pluralName: 'analytics-campaign-clicks';
    singularName: 'analytics-campaign-click';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    campaign_id: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ip_address: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-campaign-click.analytics-campaign-click'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    timestamp: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    utm_campaign: Schema.Attribute.String;
    utm_medium: Schema.Attribute.String;
    utm_source: Schema.Attribute.String;
  };
}

export interface ApiAnalyticsEventAnalyticsEvent
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_events';
  info: {
    description: 'Managed Analytics Event entity';
    displayName: 'Analytics Event';
    pluralName: 'analytics-events';
    singularName: 'analytics-event';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    event_category: Schema.Attribute.String;
    event_data: Schema.Attribute.JSON;
    event_label: Schema.Attribute.String;
    event_type: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-event.analytics-event'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    session_id: Schema.Attribute.String & Schema.Attribute.Required;
    timestamp: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAnalyticsFunnelAnalyticsFunnel
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_funnels';
  info: {
    description: 'Managed Analytics Funnel entity';
    displayName: 'Analytics Funnel';
    pluralName: 'analytics-funnels';
    singularName: 'analytics-funnel';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    conversion_rate: Schema.Attribute.Float & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    funnel_name: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-funnel.analytics-funnel'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    steps: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAnalyticsHeatmapClickAnalyticsHeatmapClick
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_heatmap_clicks';
  info: {
    description: 'Managed Analytics Heatmap Click entity';
    displayName: 'Analytics Heatmap Click';
    pluralName: 'analytics-heatmap-clicks';
    singularName: 'analytics-heatmap-click';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    element_selector: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-heatmap-click.analytics-heatmap-click'
    > &
      Schema.Attribute.Private;
    page_path: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    timestamp: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    viewport_height: Schema.Attribute.Integer;
    viewport_width: Schema.Attribute.Integer;
    x_percentage: Schema.Attribute.Float & Schema.Attribute.Required;
    y_percentage: Schema.Attribute.Float & Schema.Attribute.Required;
  };
}

export interface ApiAnalyticsPageViewAnalyticsPageView
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_page_views';
  info: {
    description: 'Managed Analytics Page View entity';
    displayName: 'Analytics Page View';
    pluralName: 'analytics-page-views';
    singularName: 'analytics-page-view';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dwell_time_seconds: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-page-view.analytics-page-view'
    > &
      Schema.Attribute.Private;
    page_title: Schema.Attribute.String;
    path: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    referrer: Schema.Attribute.String;
    session_id: Schema.Attribute.String & Schema.Attribute.Required;
    timestamp: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAnalyticsSessionAnalyticsSession
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_sessions';
  info: {
    description: 'Managed Analytics Session entity';
    displayName: 'Analytics Session';
    pluralName: 'analytics-sessions';
    singularName: 'analytics-session';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    browser: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    device_type: Schema.Attribute.String;
    duration_seconds: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    entry_page: Schema.Attribute.String;
    ip_address: Schema.Attribute.String;
    last_active_at: Schema.Attribute.DateTime;
    latitude: Schema.Attribute.Float;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-session.analytics-session'
    > &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.Float;
    os: Schema.Attribute.String;
    page_views_count: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    publishedAt: Schema.Attribute.DateTime;
    session_id: Schema.Attribute.String & Schema.Attribute.Required;
    started_at: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    visitor_id: Schema.Attribute.String;
  };
}

export interface ApiAnalyticsTouchpointJourneyAnalyticsTouchpointJourney
  extends Struct.CollectionTypeSchema {
  collectionName: 'analytics_touchpoint_journeys';
  info: {
    description: 'Managed Analytics Touchpoint Journey entity';
    displayName: 'Analytics Touchpoint Journey';
    pluralName: 'analytics-touchpoint-journeys';
    singularName: 'analytics-touchpoint-journey';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    converted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::analytics-touchpoint-journey.analytics-touchpoint-journey'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    touchpoints: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    visitor_id: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiAppointmentAppointment extends Struct.CollectionTypeSchema {
  collectionName: 'appointments';
  info: {
    description: 'Managed Appointment entity';
    displayName: 'Appointment';
    pluralName: 'appointments';
    singularName: 'appointment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    budget: Schema.Attribute.String;
    client_email: Schema.Attribute.String;
    client_name: Schema.Attribute.String & Schema.Attribute.Required;
    client_phone: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      ['pending', 'confirmed', 'completed', 'cancelled']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    features: Schema.Attribute.JSON;
    fuel: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::appointment.appointment'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    time: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    use_case: Schema.Attribute.String;
    vehicle_type: Schema.Attribute.String;
  };
}

export interface ApiBlogBlog extends Struct.CollectionTypeSchema {
  collectionName: 'blogs';
  info: {
    description: 'Managed Blog entity';
    displayName: 'Blog';
    pluralName: 'blogs';
    singularName: 'blog';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.String;
    content: Schema.Attribute.RichText;
    cover_image: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    excerpt: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'> &
      Schema.Attribute.Private;
    published_date: Schema.Attribute.Date;
    publishedAt: Schema.Attribute.DateTime;
    read_time: Schema.Attribute.String;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    tags: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCampaignCampaign extends Struct.CollectionTypeSchema {
  collectionName: 'campaigns';
  info: {
    description: 'Marketing Campaigns & Promo Codes';
    displayName: 'Campaign';
    pluralName: 'campaigns';
    singularName: 'campaign';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    budget: Schema.Attribute.Decimal;
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discountType: Schema.Attribute.Enumeration<['PERCENTAGE', 'FIXED']> &
      Schema.Attribute.DefaultTo<'PERCENTAGE'>;
    discountValue: Schema.Attribute.Decimal & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campaign.campaign'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    usageCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiCarListingCarListing extends Struct.CollectionTypeSchema {
  collectionName: 'car_listings';
  info: {
    description: 'Managed Car Listing entity';
    displayName: 'Car Listing';
    pluralName: 'car-listings';
    singularName: 'car-listing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    color: Schema.Attribute.String;
    condition: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Used'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      ['Available', 'Reserved', 'Sold']
    > &
      Schema.Attribute.DefaultTo<'Available'>;
    engine: Schema.Attribute.String;
    features: Schema.Attribute.JSON;
    fuel_type: Schema.Attribute.String;
    images: Schema.Attribute.JSON;
    interior_color: Schema.Attribute.String;
    listing_description: Schema.Attribute.Text;
    listing_title: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::car-listing.car-listing'
    > &
      Schema.Attribute.Private;
    make: Schema.Attribute.String & Schema.Attribute.Required;
    mileage: Schema.Attribute.BigInteger;
    model: Schema.Attribute.String & Schema.Attribute.Required;
    offer_type: Schema.Attribute.String;
    price: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    tagline: Schema.Attribute.String;
    transmission: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.String & Schema.Attribute.Required;
    youtube_video_url: Schema.Attribute.String;
  };
}

export interface ApiCategoryCategory extends Struct.CollectionTypeSchema {
  collectionName: 'categories';
  info: {
    description: 'Product Categories';
    displayName: 'Category';
    pluralName: 'categories';
    singularName: 'category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.String;
    itemCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::category.category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmActivityLogCrmActivityLog
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_activity_logs';
  info: {
    description: 'Managed CRM Activity Log entity';
    displayName: 'CRM Activity Log';
    pluralName: 'crm-activity-logs';
    singularName: 'crm-activity-log';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_archived: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    lead_id: Schema.Attribute.String;
    lead_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-activity-log.crm-activity-log'
    > &
      Schema.Attribute.Private;
    log_date: Schema.Attribute.DateTime;
    publishedAt: Schema.Attribute.DateTime;
    subject: Schema.Attribute.String;
    type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmCampaignCrmCampaign extends Struct.CollectionTypeSchema {
  collectionName: 'crm_campaigns';
  info: {
    description: 'Managed CRM Campaign entity';
    displayName: 'CRM Campaign';
    pluralName: 'crm-campaigns';
    singularName: 'crm-campaign';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aligned_vehicle_id: Schema.Attribute.String;
    budget: Schema.Attribute.BigInteger;
    channels: Schema.Attribute.JSON;
    conversion_rate: Schema.Attribute.Float & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      ['Active', 'Paused', 'Completed']
    > &
      Schema.Attribute.DefaultTo<'Active'>;
    description: Schema.Attribute.Text;
    end_date: Schema.Attribute.Date;
    leads_count: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-campaign.crm-campaign'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    spend: Schema.Attribute.BigInteger;
    start_date: Schema.Attribute.Date;
    total_revenue: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'0'>;
    type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    won_count: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiCrmChatLeadCrmChatLead extends Struct.CollectionTypeSchema {
  collectionName: 'crm_chat_leads';
  info: {
    description: 'Managed CRM Chat Lead entity';
    displayName: 'CRM Chat Lead';
    pluralName: 'crm-chat-leads';
    singularName: 'crm-chat-lead';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    browser: Schema.Attribute.String;
    captured_at: Schema.Attribute.DateTime;
    conversion_probability: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<30>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.String & Schema.Attribute.DefaultTo<'new'>;
    device: Schema.Attribute.String;
    email: Schema.Attribute.String;
    intent_score: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<50>;
    intent_tier: Schema.Attribute.String & Schema.Attribute.DefaultTo<'MEDIUM'>;
    ip_address: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-chat-lead.crm-chat-lead'
    > &
      Schema.Attribute.Private;
    location_name: Schema.Attribute.String;
    name: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    os: Schema.Attribute.String;
    page_url: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    source: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Live Chat'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_agent: Schema.Attribute.String;
  };
}

export interface ApiCrmLeadSourceCrmLeadSource
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_lead_sources';
  info: {
    description: 'Managed CRM Lead Source entity';
    displayName: 'CRM Lead Source';
    pluralName: 'crm-lead-sources';
    singularName: 'crm-lead-source';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-lead-source.crm-lead-source'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmLeadCrmLead extends Struct.CollectionTypeSchema {
  collectionName: 'crm_leads';
  info: {
    description: 'Managed CRM Lead entity';
    displayName: 'CRM Lead';
    pluralName: 'crm-leads';
    singularName: 'crm-lead';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    assigned_to: Schema.Attribute.String;
    behavioral_metrics: Schema.Attribute.JSON;
    browser: Schema.Attribute.String;
    buying_timeline: Schema.Attribute.String;
    campaign_id: Schema.Attribute.String;
    company: Schema.Attribute.String;
    conversion_probability: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<50>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      [
        'new',
        'contacted',
        'qualified',
        'proposal',
        'negotiation',
        'won',
        'lost',
      ]
    > &
      Schema.Attribute.DefaultTo<'new'>;
    device: Schema.Attribute.String;
    email: Schema.Attribute.String;
    intent_score: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<20>;
    intent_tier: Schema.Attribute.Enumeration<
      ['LOW', 'MEDIUM', 'HIGH', 'HOT']
    > &
      Schema.Attribute.DefaultTo<'LOW'>;
    ip_address: Schema.Attribute.String;
    latitude: Schema.Attribute.Float;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-lead.crm-lead'
    > &
      Schema.Attribute.Private;
    location_name: Schema.Attribute.String;
    longitude: Schema.Attribute.Float;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    os: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    score_last_calculated_at: Schema.Attribute.DateTime;
    source: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmOpportunityCrmOpportunity
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_opportunities';
  info: {
    description: 'Managed CRM Opportunity entity';
    displayName: 'CRM Opportunity';
    pluralName: 'crm-opportunities';
    singularName: 'crm-opportunity';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    campaign_id: Schema.Attribute.String;
    close_date: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    expected_value: Schema.Attribute.BigInteger;
    lead_id: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-opportunity.crm-opportunity'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    probability: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<50>;
    publishedAt: Schema.Attribute.DateTime;
    stage: Schema.Attribute.Enumeration<
      ['qualification', 'proposal', 'negotiation', 'won_deals']
    > &
      Schema.Attribute.DefaultTo<'qualification'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vehicle_id: Schema.Attribute.String;
    vehicle_name: Schema.Attribute.String;
    youtube_video_url: Schema.Attribute.String;
  };
}

export interface ApiCrmRepVelocityCrmRepVelocity
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_rep_velocities';
  info: {
    description: 'Managed CRM Rep Velocity entity';
    displayName: 'CRM Rep Velocity';
    pluralName: 'crm-rep-velocities';
    singularName: 'crm-rep-velocity';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    avg_response_min: Schema.Attribute.Float & Schema.Attribute.DefaultTo<0>;
    breaches: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    compliance_percent: Schema.Attribute.Float &
      Schema.Attribute.DefaultTo<100>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Optimal'>;
    leads_assigned: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-rep-velocity.crm-rep-velocity'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmScoringRuleCrmScoringRule
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_scoring_rules';
  info: {
    description: 'Managed CRM Scoring Rule entity';
    displayName: 'CRM Scoring Rule';
    pluralName: 'crm-scoring-rules';
    singularName: 'crm-scoring-rule';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-scoring-rule.crm-scoring-rule'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rule_name: Schema.Attribute.String & Schema.Attribute.Required;
    score_impact: Schema.Attribute.Integer & Schema.Attribute.Required;
    trigger_event: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmSiteSettingCrmSiteSetting
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_site_settings';
  info: {
    description: 'Managed CRM Site Setting entity';
    displayName: 'CRM Site Setting';
    pluralName: 'crm-site-settings';
    singularName: 'crm-site-setting';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    key: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-site-setting.crm-site-setting'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    value: Schema.Attribute.JSON;
  };
}

export interface ApiCrmSlaMetricCrmSlaMetric
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_sla_metrics';
  info: {
    description: 'Managed CRM SLA Metric entity';
    displayName: 'CRM SLA Metric';
    pluralName: 'crm-sla-metrics';
    singularName: 'crm-sla-metric';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    breach_count: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-sla-metric.crm-sla-metric'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    target_minutes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<15>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warning_threshold: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<10>;
  };
}

export interface ApiCrmSubtaskCrmSubtask extends Struct.CollectionTypeSchema {
  collectionName: 'crm_subtasks';
  info: {
    description: 'Managed CRM Subtask entity';
    displayName: 'CRM Subtask';
    pluralName: 'crm-subtasks';
    singularName: 'crm-subtask';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    assigned_to: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    creator_id: Schema.Attribute.String;
    currentStatus: Schema.Attribute.Enumeration<['pending', 'completed']> &
      Schema.Attribute.DefaultTo<'pending'>;
    description: Schema.Attribute.Text;
    due_date: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-subtask.crm-subtask'
    > &
      Schema.Attribute.Private;
    parent_id: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    resolution_note: Schema.Attribute.Text;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmSupportMessageCrmSupportMessage
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_support_messages';
  info: {
    description: 'Managed CRM Support Message entity';
    displayName: 'CRM Support Message';
    pluralName: 'crm-support-messages';
    singularName: 'crm-support-message';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    attachment_name: Schema.Attribute.String;
    attachment_type: Schema.Attribute.String;
    attachment_url: Schema.Attribute.String;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_from_portal: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-support-message.crm-support-message'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sender_name: Schema.Attribute.String & Schema.Attribute.Required;
    sent_at: Schema.Attribute.DateTime;
    thread_id: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmSupportThreadCrmSupportThread
  extends Struct.CollectionTypeSchema {
  collectionName: 'crm_support_threads';
  info: {
    description: 'Managed CRM Support Thread entity';
    displayName: 'CRM Support Thread';
    pluralName: 'crm-support-threads';
    singularName: 'crm-support-thread';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    browser: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      ['open', 'pending', 'resolved', 'closed']
    > &
      Schema.Attribute.DefaultTo<'open'>;
    customer_email: Schema.Attribute.String;
    customer_id: Schema.Attribute.String;
    customer_name: Schema.Attribute.String & Schema.Attribute.Required;
    customer_phone: Schema.Attribute.String;
    device: Schema.Attribute.String;
    ip_address: Schema.Attribute.String;
    last_message_at: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-support-thread.crm-support-thread'
    > &
      Schema.Attribute.Private;
    location_name: Schema.Attribute.String;
    os: Schema.Attribute.String;
    priority: Schema.Attribute.Enumeration<
      ['low', 'normal', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    publishedAt: Schema.Attribute.DateTime;
    subject: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCrmTaskCrmTask extends Struct.CollectionTypeSchema {
  collectionName: 'crm_tasks';
  info: {
    description: 'Managed CRM Task entity';
    displayName: 'CRM Task';
    pluralName: 'crm-tasks';
    singularName: 'crm-task';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    archive_reason: Schema.Attribute.Text;
    archived_at: Schema.Attribute.DateTime;
    assigned_to: Schema.Attribute.String;
    category: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    creator_id: Schema.Attribute.String;
    currentStatus: Schema.Attribute.Enumeration<
      ['pending', 'in_progress', 'completed', 'archived']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    description: Schema.Attribute.Text;
    due_date: Schema.Attribute.DateTime;
    financial_weight: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::crm-task.crm-task'
    > &
      Schema.Attribute.Private;
    parent_id: Schema.Attribute.String;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    publishedAt: Schema.Attribute.DateTime;
    reminders: Schema.Attribute.JSON;
    resolution_note: Schema.Attribute.Text;
    shared_user_ids: Schema.Attribute.JSON;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
    taskable_id: Schema.Attribute.String;
    taskable_type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiInventoryMovementInventoryMovement
  extends Struct.CollectionTypeSchema {
  collectionName: 'inventory_movements';
  info: {
    description: 'Stock movement audit log';
    displayName: 'Inventory Movement';
    pluralName: 'inventory-movements';
    singularName: 'inventory-movement';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory-movement.inventory-movement'
    > &
      Schema.Attribute.Private;
    performedBy: Schema.Attribute.String & Schema.Attribute.DefaultTo<'SYSTEM'>;
    publishedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    reference: Schema.Attribute.String;
    sku: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['RESTOCK', 'TRANSFER', 'SALE', 'ADJUSTMENT', 'RETURN']
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiOrderOrder extends Struct.CollectionTypeSchema {
  collectionName: 'orders';
  info: {
    description: 'Sales Orders Lifecycle';
    displayName: 'Order';
    pluralName: 'orders';
    singularName: 'order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customerEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    customerName: Schema.Attribute.String & Schema.Attribute.Required;
    discountAmount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    items: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::order.order'> &
      Schema.Attribute.Private;
    orderNumber: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    orderStatus: Schema.Attribute.Enumeration<
      [
        'PENDING',
        'PAYMENT_PENDING',
        'PAID',
        'PROCESSING',
        'PACKED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED',
      ]
    > &
      Schema.Attribute.DefaultTo<'PENDING'>;
    paymentMethod: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'CREDIT_CARD'>;
    paymentStatus: Schema.Attribute.Enumeration<
      ['UNPAID', 'PAID', 'REFUNDED', 'FAILED']
    > &
      Schema.Attribute.DefaultTo<'PAID'>;
    publishedAt: Schema.Attribute.DateTime;
    shippingAddress: Schema.Attribute.JSON;
    shippingCost: Schema.Attribute.Decimal;
    subtotal: Schema.Attribute.Decimal;
    taxAmount: Schema.Attribute.Decimal;
    timeline: Schema.Attribute.JSON;
    totalAmount: Schema.Attribute.Decimal & Schema.Attribute.Required;
    trackingNumber: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProductProduct extends Struct.CollectionTypeSchema {
  collectionName: 'products';
  info: {
    description: 'Futuristic E-Commerce Product Catalog';
    displayName: 'Product';
    pluralName: 'products';
    singularName: 'product';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    badge: Schema.Attribute.String;
    brand: Schema.Attribute.String & Schema.Attribute.DefaultTo<'NEXUS PRIME'>;
    category: Schema.Attribute.Relation<'manyToOne', 'api::category.category'>;
    compareAtPrice: Schema.Attribute.Decimal;
    costPrice: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      ['draft', 'published', 'archived']
    > &
      Schema.Attribute.DefaultTo<'published'>;
    description: Schema.Attribute.RichText;
    images: Schema.Attribute.JSON;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product.product'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Float & Schema.Attribute.DefaultTo<4.9>;
    reservedStock: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    reviewsCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<24>;
    seoDescription: Schema.Attribute.Text;
    seoTitle: Schema.Attribute.String;
    shortDescription: Schema.Attribute.Text;
    sku: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    specifications: Schema.Attribute.JSON;
    stock: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    variants: Schema.Attribute.JSON;
  };
}

export interface ApiSupplierSupplier extends Struct.CollectionTypeSchema {
  collectionName: 'suppliers';
  info: {
    description: 'Procurement Suppliers';
    displayName: 'Supplier';
    pluralName: 'suppliers';
    singularName: 'supplier';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    contactName: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    leadTimeDays: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<7>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier.supplier'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Float & Schema.Attribute.DefaultTo<4.8>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTradeInRequestTradeInRequest
  extends Struct.CollectionTypeSchema {
  collectionName: 'trade_in_requests';
  info: {
    description: 'Managed Trade In Request entity';
    displayName: 'Trade In Request';
    pluralName: 'trade-in-requests';
    singularName: 'trade-in-request';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    admin_notes: Schema.Attribute.Text;
    client_email: Schema.Attribute.String;
    client_name: Schema.Attribute.String & Schema.Attribute.Required;
    client_notes: Schema.Attribute.Text;
    client_phone: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currentStatus: Schema.Attribute.Enumeration<
      ['Pending', 'In Review', 'Valued', 'Approved', 'Rejected']
    > &
      Schema.Attribute.DefaultTo<'Pending'>;
    expected_trade_value: Schema.Attribute.BigInteger;
    images: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::trade-in-request.trade-in-request'
    > &
      Schema.Attribute.Private;
    offered_valuation: Schema.Attribute.BigInteger;
    publishedAt: Schema.Attribute.DateTime;
    target_vehicle_id: Schema.Attribute.String;
    target_vehicle_name: Schema.Attribute.String;
    target_vehicle_price: Schema.Attribute.String;
    trade_vehicle_condition: Schema.Attribute.String;
    trade_vehicle_make: Schema.Attribute.String & Schema.Attribute.Required;
    trade_vehicle_mileage: Schema.Attribute.String;
    trade_vehicle_model: Schema.Attribute.String & Schema.Attribute.Required;
    trade_vehicle_registration: Schema.Attribute.String;
    trade_vehicle_year: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::accessory.accessory': ApiAccessoryAccessory;
      'api::analytics-blacklisted-ip.analytics-blacklisted-ip': ApiAnalyticsBlacklistedIpAnalyticsBlacklistedIp;
      'api::analytics-campaign-click.analytics-campaign-click': ApiAnalyticsCampaignClickAnalyticsCampaignClick;
      'api::analytics-event.analytics-event': ApiAnalyticsEventAnalyticsEvent;
      'api::analytics-funnel.analytics-funnel': ApiAnalyticsFunnelAnalyticsFunnel;
      'api::analytics-heatmap-click.analytics-heatmap-click': ApiAnalyticsHeatmapClickAnalyticsHeatmapClick;
      'api::analytics-page-view.analytics-page-view': ApiAnalyticsPageViewAnalyticsPageView;
      'api::analytics-session.analytics-session': ApiAnalyticsSessionAnalyticsSession;
      'api::analytics-touchpoint-journey.analytics-touchpoint-journey': ApiAnalyticsTouchpointJourneyAnalyticsTouchpointJourney;
      'api::appointment.appointment': ApiAppointmentAppointment;
      'api::blog.blog': ApiBlogBlog;
      'api::campaign.campaign': ApiCampaignCampaign;
      'api::car-listing.car-listing': ApiCarListingCarListing;
      'api::category.category': ApiCategoryCategory;
      'api::crm-activity-log.crm-activity-log': ApiCrmActivityLogCrmActivityLog;
      'api::crm-campaign.crm-campaign': ApiCrmCampaignCrmCampaign;
      'api::crm-chat-lead.crm-chat-lead': ApiCrmChatLeadCrmChatLead;
      'api::crm-lead-source.crm-lead-source': ApiCrmLeadSourceCrmLeadSource;
      'api::crm-lead.crm-lead': ApiCrmLeadCrmLead;
      'api::crm-opportunity.crm-opportunity': ApiCrmOpportunityCrmOpportunity;
      'api::crm-rep-velocity.crm-rep-velocity': ApiCrmRepVelocityCrmRepVelocity;
      'api::crm-scoring-rule.crm-scoring-rule': ApiCrmScoringRuleCrmScoringRule;
      'api::crm-site-setting.crm-site-setting': ApiCrmSiteSettingCrmSiteSetting;
      'api::crm-sla-metric.crm-sla-metric': ApiCrmSlaMetricCrmSlaMetric;
      'api::crm-subtask.crm-subtask': ApiCrmSubtaskCrmSubtask;
      'api::crm-support-message.crm-support-message': ApiCrmSupportMessageCrmSupportMessage;
      'api::crm-support-thread.crm-support-thread': ApiCrmSupportThreadCrmSupportThread;
      'api::crm-task.crm-task': ApiCrmTaskCrmTask;
      'api::inventory-movement.inventory-movement': ApiInventoryMovementInventoryMovement;
      'api::order.order': ApiOrderOrder;
      'api::product.product': ApiProductProduct;
      'api::supplier.supplier': ApiSupplierSupplier;
      'api::trade-in-request.trade-in-request': ApiTradeInRequestTradeInRequest;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
