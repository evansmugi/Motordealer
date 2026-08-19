-- ================================================================
-- KK Automotive & AETHEL MOTORS — CRM & Analytics Database Schema
-- 100% Replica from Fuse CRM & Analytics Schema
-- ================================================================

-- 1. CRM Leads
CREATE TABLE IF NOT EXISTS crm_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  campaign_id TEXT,
  assigned_to TEXT,
  notes TEXT,
  conversion_probability INTEGER DEFAULT 50,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 2. CRM Opportunities (Sales Pipeline)
CREATE TABLE IF NOT EXISTS crm_opportunities (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  vehicle_id TEXT,
  vehicle_name TEXT,
  name TEXT NOT NULL,
  expected_value BIGINT DEFAULT 0,
  close_date DATE,
  probability INTEGER DEFAULT 50,
  stage TEXT DEFAULT 'qualification',
  campaign_id TEXT,
  notes TEXT,
  updated_at DATE DEFAULT CURRENT_DATE,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 3. CRM Campaigns
CREATE TABLE IF NOT EXISTS crm_campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  type TEXT,
  budget BIGINT DEFAULT 0,
  spend BIGINT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Active',
  description TEXT,
  leads_count INTEGER DEFAULT 0,
  won_count INTEGER DEFAULT 0,
  total_revenue BIGINT DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  aligned_vehicle_id TEXT,
  channels JSONB DEFAULT '[]'::jsonb
);

-- 4. CRM Tasks
CREATE TABLE IF NOT EXISTS crm_tasks (
  id TEXT PRIMARY KEY,
  parent_id TEXT,
  subject TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  category TEXT,
  assigned_to TEXT,
  creator_id TEXT,
  shared_user_ids JSONB DEFAULT '[]'::jsonb,
  financial_weight BIGINT DEFAULT 0,
  taskable_type TEXT,
  taskable_id TEXT,
  reminders JSONB DEFAULT '[]'::jsonb,
  resolution_note TEXT,
  archive_reason TEXT,
  archived_at DATE,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 5. CRM Subtasks
CREATE TABLE IF NOT EXISTS crm_subtasks (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES crm_tasks(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT,
  creator_id TEXT,
  status TEXT DEFAULT 'pending',
  due_date TEXT,
  resolution_note TEXT,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 6. CRM Lead Sources
CREATE TABLE IF NOT EXISTS crm_lead_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 7. CRM Activity / Communication Logs
CREATE TABLE IF NOT EXISTS crm_activity_logs (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  lead_name TEXT,
  type TEXT,
  subject TEXT,
  content TEXT,
  is_archived BOOLEAN DEFAULT false,
  log_date TEXT
);

-- 8. CRM Support Threads
CREATE TABLE IF NOT EXISTS crm_support_threads (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT,
  subject TEXT,
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'open',
  last_message_at TEXT
);

-- 9. CRM Support Messages
CREATE TABLE IF NOT EXISTS crm_support_messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT REFERENCES crm_support_threads(id) ON DELETE CASCADE,
  sender_name TEXT,
  is_from_portal BOOLEAN DEFAULT false,
  content TEXT,
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_url TEXT,
  created_at TEXT
);

-- 10. CRM SLA Metrics
CREATE TABLE IF NOT EXISTS crm_sla_metrics (
  id TEXT PRIMARY KEY,
  customer_tier TEXT NOT NULL,
  avg_response_min INTEGER DEFAULT 0,
  compliance_percent NUMERIC(5,2) DEFAULT 0,
  escalation_count INTEGER DEFAULT 0
);

-- 11. Analytics Visitor Sessions
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id TEXT PRIMARY KEY,
  ip_address TEXT,
  location_name TEXT,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  city TEXT,
  geo_country TEXT,
  geo_lat NUMERIC(10,6),
  geo_lng NUMERIC(10,6),
  browser TEXT,
  os TEXT,
  device TEXT,
  page_section TEXT,
  landing_page TEXT,
  acquisition_source TEXT,
  acquisition_type TEXT,
  is_bot BOOLEAN DEFAULT false,
  is_proxy BOOLEAN DEFAULT false,
  is_whitelisted BOOLEAN DEFAULT false,
  total_events INTEGER DEFAULT 0,
  conversion_score INTEGER DEFAULT 0,
  engagement_points INTEGER DEFAULT 0,
  last_active_at TEXT,
  created_at TEXT
);

-- 12. Analytics Attribution Campaigns (Campaign Monitor)
CREATE TABLE IF NOT EXISTS analytics_campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  vehicle_id TEXT,
  vehicle_name TEXT,
  vehicle_price TEXT,
  platform TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  target_url TEXT,
  budget TEXT,
  budget_kes BIGINT DEFAULT 0,
  spend_kes BIGINT DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  deals_won_count INTEGER DEFAULT 0,
  revenue_generated_kes BIGINT DEFAULT 0,
  roas_multiplier NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'Active',
  auto_optimize BOOLEAN DEFAULT false,
  channels JSONB DEFAULT '[]'::jsonb,
  created_at TEXT
);

-- 13. Analytics Campaign Clicks
CREATE TABLE IF NOT EXISTS analytics_campaign_clicks (
  id TEXT PRIMARY KEY,
  campaign_id TEXT,
  campaign_name TEXT,
  vehicle_id TEXT,
  vehicle_name TEXT,
  platform TEXT,
  ip_address TEXT,
  location_name TEXT,
  browser TEXT,
  device TEXT,
  os TEXT,
  "timestamp" TEXT
);

-- 14. Analytics Multi-Touch Attribution Journeys
CREATE TABLE IF NOT EXISTS analytics_touchpoint_journeys (
  id TEXT PRIMARY KEY,
  deal_id TEXT,
  customer_name TEXT,
  vehicle_name TEXT,
  deal_value BIGINT DEFAULT 0,
  closed_date DATE,
  touchpoints JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON crm_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_opps_stage ON crm_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opps_lead ON crm_opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_subtasks_parent ON crm_subtasks(parent_id);
CREATE INDEX IF NOT EXISTS idx_logs_lead ON crm_activity_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON crm_support_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON analytics_sessions(geo_country);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON analytics_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_clicks_campaign ON analytics_campaign_clicks(campaign_id);
