
import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

interface ExportControlsProps {
    data: any[];
    filename: string;
    label?: string;
}

const ExportControls: React.FC<ExportControlsProps> = ({ data, filename, label = 'Exportar' }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => exportToCSV(data, filename)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Exportar a CSV"
            >
                <FileText size={16} />
                <span className="hidden sm:inline">CSV</span>
            </button>
            <button
                onClick={() => exportToExcel(data, filename)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                title="Exportar a Excel"
            >
                <FileSpreadsheet size={16} />
                <span className="hidden sm:inline">Excel</span>
            </button>
        </div>
    );
};

export default ExportControls;
