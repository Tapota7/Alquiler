
import React, { useState } from 'react';
import { Filter, X, Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { PaymentStatus, FilterCriteria } from '../types';

interface AdvancedFilterPanelProps {
    onFilterChange: (criteria: FilterCriteria) => void;
    onClear: () => void;
    showStatusFilter?: boolean;
}

const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
    onFilterChange,
    onClear,
    showStatusFilter = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [criteria, setCriteria] = useState<FilterCriteria>({});

    const handleStatusChange = (status: PaymentStatus) => {
        const currentStatuses = criteria.status || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter(s => s !== status)
            : [...currentStatuses, status];

        updateCriteria({ ...criteria, status: newStatuses });
    };

    const updateCriteria = (newCriteria: FilterCriteria) => {
        setCriteria(newCriteria);
        onFilterChange(newCriteria);
    };

    const clearAll = () => {
        setCriteria({});
        onClear();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-slate-700 dark:text-white font-bold">
                    <Filter size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Filtros Avanzados</span>
                    {(Object.keys(criteria).length > 0) && (
                        <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                            Activos
                        </span>
                    )}
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </div>

            {isOpen && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-6">
                    {/* Status Filter */}
                    {showStatusFilter && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado del Pago</label>
                            <div className="flex flex-wrap gap-2">
                                {[PaymentStatus.PAID, PaymentStatus.PENDING, PaymentStatus.OVERDUE].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${criteria.status?.includes(status)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                                            }`}
                                    >
                                        {status === PaymentStatus.PAID && 'Pagado'}
                                        {status === PaymentStatus.PENDING && 'Pendiente'}
                                        {status === PaymentStatus.OVERDUE && 'Atrasado'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amount Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rango de Monto</label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full pl-7 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                    value={criteria.amountRange?.min || ''}
                                    onChange={e => updateCriteria({
                                        ...criteria,
                                        amountRange: { ...criteria.amountRange, min: Number(e.target.value) || 0, max: criteria.amountRange?.max || 999999 }
                                    })}
                                />
                            </div>
                            <span className="text-slate-400">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full pl-7 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                    value={criteria.amountRange?.max || ''}
                                    onChange={e => updateCriteria({
                                        ...criteria,
                                        amountRange: { ...criteria.amountRange, min: criteria.amountRange?.min || 0, max: Number(e.target.value) || 999999 }
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={clearAll}
                            className="px-4 py-2 text-slate-500 hover:text-red-500 text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                            <X size={16} /> Limpiar Filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedFilterPanel;
