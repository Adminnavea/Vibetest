import React, { useState, useMemo } from 'react';
import { generateMockCustomers, generateCampaignMetrics } from './services/mockData';
import { Thresholds, Customer, CustomerStatus } from './types';
import ThresholdControls from './components/ThresholdControls';
import CustomerTable from './components/CustomerTable';
import EmailGenerator from './components/EmailGenerator';
import AnalyticsCharts from './components/AnalyticsCharts';
import { LayoutDashboard, Users, BarChart3, LogOut, Bell } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [thresholds, setThresholds] = useState<Thresholds>({ churnRisk: 75, unsubscribeRisk: 60 });
  const [customers] = useState(() => generateMockCustomers(15)); // Generate 15 mock customers
  const [metrics] = useState(() => generateCampaignMetrics());
  
  const [selectedCustomer, setSelectedCustomer] = useState<{c: Customer, s: CustomerStatus} | null>(null);
  const [view, setView] = useState<'dashboard' | 'analytics'>('dashboard');

  // Derived stats
  const stats = useMemo(() => {
    let churnRiskCount = 0;
    let unsubRiskCount = 0;

    customers.forEach(c => {
      if (c.churnPropensity >= thresholds.churnRisk) {
        churnRiskCount++;
      } else if (c.unsubscribePropensity >= thresholds.unsubscribeRisk) {
        unsubRiskCount++;
      }
    });

    return { churnRiskCount, unsubRiskCount };
  }, [customers, thresholds]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">R</span>
            RetainAI
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
             onClick={() => setView('analytics')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'analytics' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-5 h-5" />
            Campaign Lift
          </button>
          <div className="pt-4 mt-4 border-t border-slate-800">
             <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</div>
             <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white cursor-pointer">
                <Users className="w-5 h-5" />
                Settings
             </div>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
              <div>
                 <div className="text-sm font-medium text-white">Marketing Mgr</div>
                 <div className="text-xs text-slate-500">admin@corp.com</div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {view === 'dashboard' ? 'Churn Management Console' : 'Campaign Effectiveness'}
            </h2>
            <p className="text-slate-500 mt-1">
              {view === 'dashboard' ? 'Monitor real-time risk and automate retention actions.' : 'Analyze lift and retention performance over time.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition relative">
               <Bell className="w-6 h-6" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
            </button>
          </div>
        </header>

        {view === 'dashboard' ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Controls & Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex items-center gap-2 text-red-500 mb-2">
                      <LogOut className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase">Churn Risk</span>
                   </div>
                   <div className="text-3xl font-bold text-slate-800">{stats.churnRiskCount}</div>
                   <div className="text-xs text-slate-500 mt-1">Customers needing action</div>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex items-center gap-2 text-orange-500 mb-2">
                      <Bell className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase">Unsub Risk</span>
                   </div>
                   <div className="text-3xl font-bold text-slate-800">{stats.unsubRiskCount}</div>
                   <div className="text-xs text-slate-500 mt-1">Customers to engage</div>
                </div>
              </div>

              {/* Threshold Controls */}
              <ThresholdControls thresholds={thresholds} setThresholds={setThresholds} />

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                 <h3 className="font-bold text-lg mb-2">AI Retention Copilot</h3>
                 <p className="text-indigo-100 text-sm mb-4">
                   Gemini models are ready to generate personalized offers based on your threshold settings.
                 </p>
                 <div className="text-xs bg-white/10 inline-block px-2 py-1 rounded border border-white/20">
                   Powered by Gemini 2.5
                 </div>
              </div>
            </div>

            {/* Right Column: Table */}
            <div className="col-span-12 lg:col-span-8">
              <CustomerTable 
                customers={customers} 
                thresholds={thresholds} 
                onSelectCustomer={(c, s) => setSelectedCustomer({c, s})}
              />
            </div>
          </div>
        ) : (
          <AnalyticsCharts data={metrics} />
        )}
      </main>

      {/* Modals */}
      {selectedCustomer && (
        <EmailGenerator 
          customer={selectedCustomer.c} 
          status={selectedCustomer.s}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default App;