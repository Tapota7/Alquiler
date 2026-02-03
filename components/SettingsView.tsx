
import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, DollarSign, Save, ShieldCheck } from 'lucide-react';
import { OwnerProfile, ReminderConfig, Tenant } from '../types';
import ReminderSystem from './ReminderSystem';

interface SettingsViewProps {
  owner: OwnerProfile;
  onUpdate: (profile: OwnerProfile) => void;
  reminderConfig: ReminderConfig;
  onUpdateReminderConfig: (config: ReminderConfig) => void;
  tenants: Tenant[];
}

const SettingsView: React.FC<SettingsViewProps> = ({
  owner,
  onUpdate,
  reminderConfig,
  onUpdateReminderConfig,
  tenants
}) => {
  const [formData, setFormData] = useState<OwnerProfile>(owner);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync internal state when parent state changes (important for theme toggle)
  React.useEffect(() => {
    setFormData(owner);
  }, [owner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Perfil y Ajustes</h2>
        <p className="text-slate-500 dark:text-slate-400">Configura los datos que aparecerán en tus recibos y notificaciones.</p>
      </div>

      <ReminderSystem
        config={reminderConfig}
        onUpdateConfig={onUpdateReminderConfig}
        tenants={tenants}
      />

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8 space-y-6">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <User className="text-indigo-600 dark:text-indigo-400" size={20} />
            Información del Propietario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User size={16} className="text-indigo-500 dark:text-indigo-400" /> Nombre del Propietario
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-500 dark:text-indigo-400" /> Moneda / Símbolo
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Mail size={16} className="text-indigo-500 dark:text-indigo-400" /> Correo Electrónico
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Phone size={16} className="text-indigo-500 dark:text-indigo-400" /> Teléfono de Contacto
            </label>
            <input
              required
              type="tel"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500 dark:text-indigo-400" /> Dirección de Cobro
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                onClick={() => {
                  const newTheme = formData.theme === 'dark' ? 'light' : 'dark';
                  const updatedProfile = { ...formData, theme: newTheme };
                  setFormData(updatedProfile);
                  onUpdate(updatedProfile); // Immediate theme update
                }}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Activar Modo Oscuro</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
          <div className={`flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold transition-opacity ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
            <ShieldCheck size={20} /> ¡Ajustes guardados!
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Save size={20} /> Guardar Perfil
          </button>
        </div>
      </form>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-6 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 text-sm">
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
