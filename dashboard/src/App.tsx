import { useState } from 'react';
import { ErpLayout } from './components/layout/ErpLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { ProductCatalog } from './pages/ProductCatalog';
import { InventoryManagement } from './pages/InventoryManagement';
import { ProcurementSupplier } from './pages/ProcurementSupplier';
import { SalesOrderMachine } from './pages/SalesOrderMachine';
import { CustomerIntelligence } from './pages/CustomerIntelligence';
import { MarketingStudio } from './pages/MarketingStudio';
import { FinancialReports } from './pages/FinancialReports';
import { SystemAdmin } from './pages/SystemAdmin';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'catalog':
        return <ProductCatalog />;
      case 'inventory':
        return <InventoryManagement />;
      case 'procurement':
        return <ProcurementSupplier />;
      case 'sales':
        return <SalesOrderMachine />;
      case 'crm':
        return <CustomerIntelligence />;
      case 'marketing':
        return <MarketingStudio />;
      case 'finance':
        return <FinancialReports />;
      case 'admin':
        return <SystemAdmin />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ErpLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveModule()}
    </ErpLayout>
  );
}

export default App;
