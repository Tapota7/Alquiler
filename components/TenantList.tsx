
import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Phone, Mail, MapPin, Calendar, Trash2, Edit2, UserPlus, X } from 'lucide-react';
import { Tenant, OwnerProfile } from '../types';

interface TenantListProps {
  tenants: Tenant[];
  onUpdate: (tenants: Tenant[]) => void;
  owner: OwnerProfile;
}

const TenantList: React.FC<TenantListProps> = ({ tenants, onUpdate, owner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const [formData, setFormData] = useState<Partial<Tenant>>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    startDate: new Date().toISOString().split('T')[0],
    monthlyRent: 0,
    paymentDay: 5
  });

  const filteredTenants = tenants.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTenant) {
      const updated = tenants.map(t => t.id === editingTenant.id ? { ...t, ...formData } as Tenant : t);
      onUpdate(updated);
    } else {
      const newTenant: Tenant = {
        ...formData,
        id: crypto.randomUUID(),
      } as Tenant;
      onUpdate([...tenants, newTenant]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      startDate: new Date().toISOString().split('T')[0],
      monthlyRent: 0,
      paymentDay: 5
    });
  };

  const openEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData(tenant);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este inquilino? Se perderá toda la información asociada.')) {
      onUpdate(tenants.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inquilinos</h2>
          <p className="text-slate-500">Gestiona las personas que alquilan tus propiedades.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus size={20} /> Nuevo Inquilino
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o dirección..."
          className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            No se encontraron inquilinos.
          </div>
        ) : (
          filteredTenants.map((tenant) => (
            <div key={tenant.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                      {tenant.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{tenant.fullName}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar size={12} /> Inicio: {new Date(tenant.startDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(tenant)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(tenant.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm truncate">{tenant.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={16} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm">{tenant.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={16} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm truncate">{tenant.email}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Renta Mensual</p>
                    <p className="text-xl font-bold text-slate-800">{owner.currency}{tenant.monthlyRent.toLocaleString()}</p>
                  </div>
                  <a 
                    href={`https://wa.me/${tenant.phone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl hover:bg-emerald-100 transition-colors"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingTenant ? 'Editar Inquilino' : 'Nuevo Inquilino'}</h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">WhatsApp / Cel</label>
                  <input
                    required
                    type="tel"
                    placeholder="123456789"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="juan@email.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Dirección de Propiedad</label>
                <input
                  required
                  type="text"
                  placeholder="Calle Falsa 123"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Inicio</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Día de Pago (Mensual)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="31"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.paymentDay}
                    onChange={e => setFormData({ ...formData, paymentDay: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Renta Mensual ({owner.currency})</label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-indigo-600 text-xl"
                  value={formData.monthlyRent}
                  onChange={e => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) })}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {editingTenant ? 'Guardar Cambios' : 'Crear Inquilino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantList;
