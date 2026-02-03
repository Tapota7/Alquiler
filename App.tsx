
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  LayoutDashboard, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Menu, 
  X,
  UserPlus
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TenantList from './components/TenantList';
import PaymentTracker from './components/PaymentTracker';
import SettingsView from './components/SettingsView';
import { Tenant, Payment, OwnerProfile } from './types';
import * as storage from './utils/storage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tenants' | 'payments' | 'settings'>('dashboard');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [owner, setOwner] = useState<OwnerProfile>(storage.getOwnerProfile());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setTenants(storage.getTenants());
    setPayments(storage.getPayments());
  }, []);

  const handleUpdateTenants = (newTenants: Tenant[]) => {
    setTenants(newTenants);
    storage.saveTenants(newTenants);
  };

  const handleUpdatePayments = (newPayments: Payment[]) => {
    setPayments(newPayments);
    storage.savePayments(newPayments);
  };

  const handleUpdateOwner = (newOwner: OwnerProfile) => {
    setOwner(newOwner);
    storage.saveOwnerProfile(newOwner);
  };

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'tenants', label: 'Inquilinos', icon: Users },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <span className="p-2 bg-indigo-50 rounded-lg"><LayoutDashboard size={20} /></span>
              RentMaster
            </h1>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                {owner.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{owner.name}</p>
                <p className="text-xs text-slate-400 truncate">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 lg:hidden px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
          <h2 className="font-bold text-slate-800">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard 
              tenants={tenants} 
              payments={payments} 
              owner={owner} 
              setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'tenants' && (
            <TenantList 
              tenants={tenants} 
              onUpdate={handleUpdateTenants} 
              owner={owner} 
            />
          )}
          {activeTab === 'payments' && (
            <PaymentTracker 
              tenants={tenants} 
              payments={payments} 
              onUpdate={handleUpdatePayments} 
              owner={owner} 
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              owner={owner} 
              onUpdate={handleUpdateOwner} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
