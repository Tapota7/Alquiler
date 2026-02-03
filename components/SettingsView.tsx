
import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, DollarSign, Save, ShieldCheck } from 'lucide-react';
import { OwnerProfile } from '../types';

interface SettingsViewProps {
  owner: OwnerProfile;
  onUpdate: (profile: OwnerProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ owner, onUpdate }) => {
  const [formData, setFormData] = useState<OwnerProfile>(owner);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Perfil y Ajustes</h2>
        <p className="text-slate-500">Configura los datos que aparecerán en tus recibos.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User size={16} className="text-indigo-500" /> Nombre del Propietario
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-500" /> Moneda / Símbolo
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Mail size={16} className="text-indigo-500" /> Correo Electrónico
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Phone size={16} className="text-indigo-500" /> Teléfono de Contacto
            </label>
            <input
              required
              type="tel"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" /> Dirección de Cobro
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex items-center justify-between">
          <div className={`flex items-center gap-2 text-emerald-600 font-semibold transition-opacity ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
            <ShieldCheck size={20} /> ¡Ajustes guardados!
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Save size={20} /> Guardar Configuración
          </button>
        </div>
      </form>

      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 text-amber-800 text-sm">
        <h4 className="font-bold flex items-center gap-2 mb-2 italic">
          <ShieldCheck size={18} /> Nota sobre Privacidad
        </h4>
        <p>
          Esta aplicación funciona exclusivamente de forma local. Tus datos se guardan en el navegador y nunca se envían a ningún servidor externo.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
