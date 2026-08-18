"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const INITIAL_PRODUCTS = [
    { id: '1', name: 'Enterprise ERP Suite License', category: 'Software', price: 1250, stock: 45, sku: 'SW-ERP-01', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80' },
    { id: '2', name: 'POS Thermal Barcode Printer', category: 'Hardware', price: 299, stock: 12, sku: 'HW-PRN-02', image: 'https://images.unsplash.com/photo-1612815150166-761937452957?auto=format&fit=crop&w=300&q=80' },
    { id: '3', name: 'Wireless Bluetooth Scanner', category: 'Hardware', price: 149, stock: 4, sku: 'HW-SCN-03', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecd?auto=format&fit=crop&w=300&q=80' },
    { id: '4', name: 'CRM Premium Subscription (1 Year)', category: 'Software', price: 899, stock: 100, sku: 'SW-CRM-04', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80' },
    { id: '5', name: 'Touchscreen POS Terminal 15"', category: 'Hardware', price: 850, stock: 7, sku: 'HW-TRM-05', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80' },
    { id: '6', name: 'Cloud Server Backup Node', category: 'Services', price: 450, stock: 30, sku: 'SV-BCK-06', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80' },
];
const INITIAL_LEADS = [
    { id: 'L1', name: 'Sarah Jenkins', company: 'Apex Logistics Ltd', email: 'sarah@apexlogistics.co', value: 4500, stage: 'Proposal' },
    { id: 'L2', name: 'David Omondi', company: 'Nairobi Tech Hub', email: 'david@techhub.ke', value: 2800, stage: 'Contacted' },
    { id: 'L3', name: 'Elena Rostova', company: 'Global Transport Inc', email: 'elena@globaltransport.com', value: 12000, stage: 'Won' },
    { id: 'L4', name: 'Michael Chang', company: 'Horizon Retailers', email: 'mchang@horizon.org', value: 3100, stage: 'New' },
];
function App() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('pos');
    const [products, setProducts] = (0, react_1.useState)(INITIAL_PRODUCTS);
    const [leads, setLeads] = (0, react_1.useState)(INITIAL_LEADS);
    const [cart, setCart] = (0, react_1.useState)([]);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('All');
    const [strapiStatus, setStrapiStatus] = (0, react_1.useState)({ connected: false, latency: 0 });
    const [showReceiptModal, setShowReceiptModal] = (0, react_1.useState)(false);
    const [lastOrder, setLastOrder] = (0, react_1.useState)(null);
    // Check Strapi Backend Status
    (0, react_1.useEffect)(() => {
        const checkStrapi = async () => {
            const start = Date.now();
            try {
                const res = await fetch('https://strapi.test/api', { method: 'GET' });
                const latency = Date.now() - start;
                setStrapiStatus({ connected: res.status === 404 || res.ok, latency });
            }
            catch {
                try {
                    const resLocal = await fetch('http://localhost:1337/api');
                    setStrapiStatus({ connected: resLocal.status === 404 || resLocal.ok, latency: Date.now() - start });
                }
                catch {
                    setStrapiStatus({ connected: false, latency: 0 });
                }
            }
        };
        checkStrapi();
        const interval = setInterval(checkStrapi, 15000);
        return () => clearInterval(interval);
    }, []);
    // POS Functions
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };
    const updateQuantity = (productId, delta) => {
        setCart((prev) => prev
            .map((item) => {
            if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        })
            .filter(Boolean));
    };
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const vatTax = subtotal * 0.16; // 16% VAT
    const grandTotal = subtotal + vatTax;
    const handleCheckout = () => {
        if (cart.length === 0)
            return;
        const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setLastOrder({ items: [...cart], total: grandTotal, orderId });
        // Deduct stock
        setProducts((prev) => prev.map((p) => {
            const cartItem = cart.find((ci) => ci.product.id === p.id);
            return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
        }));
        setCart([]);
        setShowReceiptModal(true);
    };
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    return (<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <lucide_react_1.Building2 className="w-6 h-6 text-white"/>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Fuse ERP Enterprise System
            </h1>
            <p className="text-xs text-slate-400 font-medium">Standalone Business Dashboard (Vite SPA)</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button onClick={() => setActiveTab('pos')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'pos'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <lucide_react_1.ShoppingCart className="w-4 h-4"/>
            <span>POS Register</span>
          </button>
          <button onClick={() => setActiveTab('crm')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'crm'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <lucide_react_1.Users className="w-4 h-4"/>
            <span>CRM Pipeline</span>
          </button>
          <button onClick={() => setActiveTab('erp')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'erp'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <lucide_react_1.Package className="w-4 h-4"/>
            <span>ERP Inventory</span>
          </button>
        </nav>

        {/* Strapi API Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${strapiStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}/>
          <span className="text-slate-300 font-medium">
            {strapiStatus.connected ? `Strapi API Online (${strapiStatus.latency}ms)` : 'Strapi Standalone Mode'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* POS Tab */}
        {activeTab === 'pos' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Catalog Section (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
                <div className="relative w-full sm:w-72">
                  <lucide_react_1.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input type="text" placeholder="Search product or SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"/>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
                  {['All', 'Hardware', 'Software', 'Services'].map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'}`}>
                      {cat}
                    </button>))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (<div key={p.id} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 group">
                    <div className="flex space-x-4">
                      <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform duration-200"/>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {p.category}
                        </span>
                        <h3 className="font-semibold text-slate-100 text-sm truncate mt-1">{p.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">SKU: {p.sku}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-emerald-400">${p.price.toLocaleString()}</span>
                          <span className={`text-xs ${p.stock < 5 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                            {p.stock} left
                          </span>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => addToCart(p)} disabled={p.stock === 0} className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/20">
                      <lucide_react_1.Plus className="w-4 h-4"/>
                      <span>Add to Cart</span>
                    </button>
                  </div>))}
              </div>
            </div>

            {/* Cart & Checkout Sidebar (1 Column) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl h-[calc(100vh-140px)] sticky top-24">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <lucide_react_1.ShoppingCart className="w-5 h-5 text-indigo-400"/>
                    <h2 className="font-bold text-slate-100">Current Order</h2>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    {cart.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[380px] my-4 pr-1">
                  {cart.length === 0 ? (<div className="text-center py-12 text-slate-500">
                      <lucide_react_1.ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                      <p className="text-sm">Your cart is empty.</p>
                      <p className="text-xs mt-1">Select items from the catalog to start an order.</p>
                    </div>) : (cart.map((item) => (<div key={item.product.id} className="py-3 flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-3">
                          <h4 className="text-xs font-semibold text-slate-200 truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-slate-400">${item.product.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                            -
                          </button>
                          <span className="text-xs font-bold text-white w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                            +
                          </button>
                        </div>
                      </div>)))}
                </div>
              </div>

              {/* Order Calculations */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>VAT (16%)</span>
                  <span>${vatTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-400">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/20">
                  <lucide_react_1.CreditCard className="w-4 h-4"/>
                  <span>Process Checkout</span>
                </button>
              </div>
            </div>
          </div>)}

        {/* CRM Tab */}
        {activeTab === 'crm' && (<div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">CRM Sales Pipeline</h2>
                <p className="text-xs text-slate-400">Track active leads and prospective deals</p>
              </div>
              <button onClick={() => {
                const name = prompt('Lead Name:');
                const company = prompt('Company:');
                const value = parseFloat(prompt('Deal Value ($):') || '0');
                if (name && company) {
                    setLeads((prev) => [
                        ...prev,
                        { id: `L${Date.now()}`, name, company, email: `${name.toLowerCase().replace(' ', '.')}@example.com`, value, stage: 'New' },
                    ]);
                }
            }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20">
                <lucide_react_1.Plus className="w-4 h-4"/>
                <span>New Lead</span>
              </button>
            </div>

            {/* Pipeline Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New', 'Contacted', 'Proposal', 'Won'].map((stage) => {
                const stageLeads = leads.filter((l) => l.stage === stage);
                const totalValue = stageLeads.reduce((sum, l) => sum + l.value, 0);
                return (<div key={stage} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col h-[520px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"/>
                        <h3 className="font-semibold text-sm text-slate-200">{stage}</h3>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-emerald-400 mt-2 mb-3">
                      Total: ${totalValue.toLocaleString()}
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                      {stageLeads.map((lead) => (<div key={lead.id} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-3 shadow-md space-y-2 group">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-xs text-white group-hover:text-indigo-400 transition-colors">
                              {lead.name}
                            </h4>
                            <span className="text-xs font-bold text-emerald-400">${lead.value.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{lead.company}</p>
                          <p className="text-[10px] text-slate-500">{lead.email}</p>

                          {/* Stage Transition Selector */}
                          <select value={lead.stage} onChange={(e) => {
                            const newStage = e.target.value;
                            setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage: newStage } : l)));
                        }} className="w-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded-lg p-1 mt-2 focus:outline-none">
                            <option value="New">Move to: New</option>
                            <option value="Contacted">Move to: Contacted</option>
                            <option value="Proposal">Move to: Proposal</option>
                            <option value="Won">Move to: Won</option>
                          </select>
                        </div>))}
                    </div>
                  </div>);
            })}
            </div>
          </div>)}

        {/* ERP Inventory & Analytics Tab */}
        {activeTab === 'erp' && (<div className="space-y-6">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <lucide_react_1.Package className="w-6 h-6"/>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total SKUs Managed</p>
                  <h3 className="text-2xl font-bold text-white">{products.length} Items</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <lucide_react_1.TrendingUp className="w-6 h-6"/>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Inventory Valuation</p>
                  <h3 className="text-2xl font-bold text-emerald-400">
                    ${products.reduce((s, p) => s + p.price * p.stock, 0).toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <lucide_react_1.BarChart3 className="w-6 h-6"/>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Low Stock Alert Count</p>
                  <h3 className="text-2xl font-bold text-amber-400">
                    {products.filter((p) => p.stock < 10).length} Items
                  </h3>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-100">Stock Inventory Master</h3>
                <span className="text-xs text-slate-400">PostgreSQL Synced Data</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Unit Price</th>
                      <th className="px-4 py-3">Stock On Hand</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((p) => (<tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white flex items-center space-x-3">
                          <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover"/>
                          <span>{p.name}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{p.sku}</td>
                        <td className="px-4 py-3 text-slate-300">{p.category}</td>
                        <td className="px-4 py-3 font-bold text-slate-200">${p.price.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-slate-100">{p.stock} units</td>
                        <td className="px-4 py-3">
                          {p.stock > 10 ? (<span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              In Stock
                            </span>) : p.stock > 0 ? (<span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Low Stock
                            </span>) : (<span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Out of Stock
                            </span>)}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>)}
      </main>

      {/* Checkout Receipt Modal */}
      {showReceiptModal && lastOrder && (<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowReceiptModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white">
              <lucide_react_1.X className="w-5 h-5"/>
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <lucide_react_1.CheckCircle className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-bold text-white">Payment Successful</h3>
              <p className="text-xs text-slate-400">Order ID: {lastOrder.orderId}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2 text-xs divide-y divide-slate-800/80">
              {lastOrder.items.map((item) => (<div key={item.product.id} className="pt-2 first:pt-0 flex justify-between">
                  <span className="text-slate-300">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold text-white">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>))}
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-sm">
              <span className="text-slate-300">Total Paid (VAT Incl.)</span>
              <span className="text-emerald-400 text-lg">${lastOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all">
                <lucide_react_1.Printer className="w-4 h-4"/>
                <span>Print Receipt</span>
              </button>
              <button onClick={() => setShowReceiptModal(false)} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all">
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
