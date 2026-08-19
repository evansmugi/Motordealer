import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 100% Fuse Automotive Luxury Dark Theme CSS
import './styles/crm-quantum.css';

// Layout & Core Pages
import AdminDashboard from './pages/AdminDashboard';
import CRMLayout from './components/crm/CRMLayout';

// Fuse CRM Suite Pages
import CRMOverview from './pages/crm/CRMOverview';
import LeadsManager from './pages/crm/LeadsManager';
import LeadProfile from './pages/crm/LeadProfile';
import LeadSourcesManager from './pages/crm/LeadSourcesManager';
import OpportunitiesGrid from './pages/crm/OpportunitiesGrid';
import PipelineKanban from './pages/crm/PipelineKanban';
import WonDealsBoard from './pages/crm/WonDealsBoard';
import CampaignsManager from './pages/crm/CampaignsManager';
import CommunicationHub from './pages/crm/CommunicationHub';
import TaskHub from './pages/crm/TaskHub';
import BookedAppointments from './pages/crm/BookedAppointments';
import NexusSupportCenter from './pages/crm/NexusSupportCenter';
import SLATracker from './pages/crm/SLATracker';
import ScoringRulesPage from './pages/crm/ScoringRulesPage';
import AISettingsPage from './pages/crm/AISettingsPage';
import TeamManager from './pages/crm/TeamManager';
import TradeInsManager from './pages/crm/TradeInsManager';
import TradeInDetail from './pages/crm/TradeInDetail';

// Fuse Analytics Suite Pages
import InsightsDashboard from './pages/analytics/InsightsDashboard';
import VisitorTracking from './pages/analytics/VisitorTracking';
import VisitorMap from './pages/analytics/VisitorMap';
import ProductTraffic from './pages/analytics/ProductTraffic';
import VehicleViewsDetail from './pages/analytics/VehicleViewsDetail';
import SecurityCenter from './pages/analytics/SecurityCenter';
import TrafficForecaster from './pages/analytics/TrafficForecaster';
import WebsiteHeatmaps from './pages/analytics/WebsiteHeatmaps';
import CustomerJourneys from './pages/analytics/CustomerJourneys';
import VisitorProfiles from './pages/analytics/VisitorProfiles';
import LiveSiteActivity from './pages/analytics/LiveSiteActivity';
import ServerVitals from './pages/analytics/ServerVitals';
import ActivityHistory from './pages/analytics/ActivityHistory';
import TrafficLogs from './pages/analytics/TrafficLogs';
import CampaignMonitor from './pages/analytics/CampaignMonitor';
import CampaignMetricsPage from './pages/analytics/CampaignMetricsPage';

import AdminLogin from './pages/AdminLogin';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import ViewListing from './pages/ViewListing';
import VehicleManagement from './pages/VehicleManagement';
import BrandIdentity from './pages/BrandIdentity';
import UserProfile from './pages/UserProfile';

// Additional ERP Pages
import { ProductCatalog } from './pages/ProductCatalog';
import { InventoryManagement } from './pages/InventoryManagement';
import { ProcurementSupplier } from './pages/ProcurementSupplier';
import { SalesOrderMachine } from './pages/SalesOrderMachine';
import { FinancialReports } from './pages/FinancialReports';
import { SystemAdmin } from './pages/SystemAdmin';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Landing & Authentication */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vehicles" element={<VehicleManagement />} />
        <Route path="/vehicles" element={<VehicleManagement />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/view-listing/:id" element={<ViewListing />} />
        <Route path="/admin/vehicles/view/:id" element={<ViewListing />} />
        <Route path="/brand-identity" element={<BrandIdentity />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Fuse CRM Suite Routes */}
        <Route path="/crm" element={<CRMLayout />}>
          <Route index element={<CRMOverview />} />
          <Route path="leads" element={<LeadsManager />} />
          <Route path="leads/archive" element={<LeadsManager />} />
          <Route path="leads/:id" element={<LeadProfile />} />
          <Route path="sources" element={<LeadSourcesManager />} />
          <Route path="lead-sources" element={<LeadSourcesManager />} />
          <Route path="opportunities" element={<OpportunitiesGrid />} />
          <Route path="pipeline" element={<PipelineKanban />} />
          <Route path="won-deals" element={<WonDealsBoard />} />
          <Route path="campaigns" element={<CampaignsManager />} />
          <Route path="marketing/segment" element={<CampaignsManager />} />
          <Route path="communication" element={<CommunicationHub />} />
          <Route path="tasks" element={<TaskHub />} />
          <Route path="appointments" element={<BookedAppointments />} />
          <Route path="support" element={<NexusSupportCenter />} />
          <Route path="sla" element={<SLATracker />} />
          <Route path="scoring-rules" element={<ScoringRulesPage />} />
          <Route path="ai-settings" element={<AISettingsPage />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="trade-ins" element={<TradeInsManager />} />
          <Route path="trade-ins/details/:id" element={<TradeInDetail />} />
          <Route path="trade-ins/:id" element={<TradeInDetail />} />
        </Route>

        {/* Fuse Analytics Suite Routes */}
        <Route path="/analytics" element={<CRMLayout />}>
          <Route index element={<InsightsDashboard />} />
          <Route path="dashboard" element={<InsightsDashboard />} />
          <Route path="watch" element={<VisitorTracking />} />
          <Route path="topology" element={<VisitorMap />} />
          <Route path="product-traffic" element={<ProductTraffic />} />
          <Route path="products" element={<ProductTraffic />} />
          <Route path="product-views/:id" element={<VehicleViewsDetail />} />
          <Route path="vehicle-views/:id" element={<VehicleViewsDetail />} />
          <Route path="shield" element={<SecurityCenter />} />
          <Route path="forecast" element={<TrafficForecaster />} />
          <Route path="heatmaps" element={<WebsiteHeatmaps />} />
          <Route path="journeys" element={<CustomerJourneys />} />
          <Route path="profiles" element={<VisitorProfiles />} />
          <Route path="live-activity" element={<LiveSiteActivity />} />
          <Route path="vitals" element={<ServerVitals />} />
          <Route path="history" element={<ActivityHistory />} />
          <Route path="visitors" element={<TrafficLogs />} />
          <Route path="campaign-monitor" element={<CampaignMonitor />} />
          <Route path="campaigns" element={<CampaignMonitor />} />
          <Route path="campaign-analytics" element={<CampaignMetricsPage />} />
          <Route path="metrics" element={<CampaignMetricsPage />} />
          <Route path="trade-ins" element={<TradeInsManager />} />
        </Route>

        {/* Core ERP Pages */}
        <Route path="/catalog" element={<ProductCatalog />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/procurement" element={<ProcurementSupplier />} />
        <Route path="/sales" element={<SalesOrderMachine />} />
        <Route path="/finance" element={<FinancialReports />} />
        <Route path="/system-admin" element={<SystemAdmin />} />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
