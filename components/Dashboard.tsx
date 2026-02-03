
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Plus,
  // Added missing CreditCard import
  CreditCard
} from 'lucide-react';
import { Tenant, Payment, PaymentStatus, OwnerProfile } from '../types';

interface DashboardProps {
  tenants: Tenant[];
  payments: Payment[];
  owner: OwnerProfile;
  setActiveTab: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tenants, payments, owner, setActiveTab }) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  const monthlyPayments = payments.filter(p => p.monthYear === currentMonth && p.status === PaymentStatus.PAID);
  const totalRevenue = monthlyPayments.reduce((acc, curr) => acc + curr.amount, 0);
  
  const pendingCount = tenants.length - monthlyPayments.length;
  
  const stats = [
    { label: 'Ingresos del Mes', value: `${owner.currency}${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Inquilinos Totales', value: tenants.length.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pagos Pendientes', value: pendingCount.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Monto Proyectado', value: `${owner.currency}${tenants.reduce((acc, t) => acc + t.monthlyRent, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Hola, de nuevo 👋</h2>
        <p className="text-slate-500 mt-1">Aquí tienes un resumen de tus alquileres para {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date())}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800">Inquilinos Recientes</h3>
            <button onClick={() => setActiveTab('tenants')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {tenants.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                No tienes inquilinos registrados aún.
              </div>
            ) : (
              tenants.slice(0, 5).map((tenant) => (
                <div key={tenant.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      {tenant.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{tenant.fullName}</p>
                      <p className="text-sm text-slate-500">{tenant.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{owner.currency}{tenant.monthlyRent.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Mes a mes</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 flex flex-col justify-between min-h-[320px]">
           <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Plus size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Acciones Rápidas</h3>
            <p className="text-indigo-100 mb-8 max-w-[240px]">Agrega un nuevo inquilino o registra un pago ahora mismo.</p>
           </div>
           
           <div className="flex flex-col gap-3 relative z-10">
              <button 
                onClick={() => setActiveTab('tenants')}
                className="w-full py-3 px-6 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                Nuevo Inquilino <ArrowUpRight size={18} />
              </button>
              <button 
                onClick={() => setActiveTab('payments')}
                className="w-full py-3 px-6 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
              >
                Registrar Pago <CreditCard size={18} />
              </button>
           </div>

           {/* Decorative elements */}
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-800/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
