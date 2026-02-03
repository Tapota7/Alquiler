
import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Plus, Trash2, Save, X } from 'lucide-react';
import { ReminderConfig, Tenant } from '../types';
import { getPendingReminders } from '../utils/reminderUtils';

interface ReminderSystemProps {
    config: ReminderConfig;
    onUpdateConfig: (config: ReminderConfig) => void;
    tenants: Tenant[];
}

const ReminderSystem: React.FC<ReminderSystemProps> = ({ config, onUpdateConfig, tenants }) => {
    const [localConfig, setLocalConfig] = useState<ReminderConfig>(config);

    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    const handleSave = () => {
        onUpdateConfig(localConfig);
        alert('Configuración guardada correctamente.');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <Bell className="text-indigo-600 dark:text-indigo-400" size={20} />
                    Configuración de Recordatorios
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Automatiza el envío de recordatorios a tus inquilinos.
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${localConfig.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                            onClick={() => setLocalConfig({ ...localConfig, enabled: !localConfig.enabled })}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${localConfig.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Activar Recordatorios Automáticos</span>
                    </div>
                </div>

                <div className={`space-y-6 transition-opacity ${localConfig.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Días de anticipación</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 dark:text-slate-400">Enviar recordatorio</span>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className="w-16 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold text-slate-800 dark:text-white"
                                value={localConfig.daysBeforeDue}
                                onChange={e => setLocalConfig({ ...localConfig, daysBeforeDue: parseInt(e.target.value) || 1 })}
                            />
                            <span className="text-slate-500 dark:text-slate-400">días antes de la fecha de vencimiento.</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Plantilla de Mensaje (WhatsApp)</label>
                        <textarea
                            className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-800 dark:text-white placeholder:text-slate-400"
                            value={localConfig.messageTemplate}
                            onChange={e => setLocalConfig({ ...localConfig, messageTemplate: e.target.value })}
                            placeholder="Hola {nombre}, recuerde que su pago vence el {fecha}."
                        />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                            Variables disponibles: <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">{`{nombre}`}</code>, <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">{`{fecha}`}</code>, <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">{`{monto}`}</code>
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Save size={18} /> Guardar Configuración
                    </button>
                </div>
            </div>
        </div >
    );
};

export default ReminderSystem;
