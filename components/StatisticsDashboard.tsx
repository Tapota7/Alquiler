
import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from 'recharts';
import { Payment, PaymentStatus, Tenant } from '../types';

interface StatisticsDashboardProps {
    payments: Payment[];
    tenants: Tenant[];
    isDarkMode?: boolean;
}

const COLORS = {
    [PaymentStatus.PAID]: '#10B981', // Emerald 500
    [PaymentStatus.PENDING]: '#F59E0B', // Amber 500
    [PaymentStatus.OVERDUE]: '#EF4444', // Red 500
};

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ payments, tenants, isDarkMode = false }) => {

    // Theme colors
    const axisColor = isDarkMode ? '#94a3b8' : '#64748B'; // slate-400 : slate-500
    const gridColor = isDarkMode ? '#334155' : '#E2E8F0'; // slate-700 : slate-200
    const toolTipStyle = {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderColor: isDarkMode ? '#334155' : '#f1f5f9',
        color: isDarkMode ? '#ffffff' : '#0f172a',
        borderRadius: '12px',
        border: '1px solid',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    };

    // 1. Payment Status Distribution (Current Month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthPayments = payments.filter(p => p.monthYear === currentMonth);

    const statusCounts = {
        [PaymentStatus.PAID]: 0,
        [PaymentStatus.PENDING]: 0,
        [PaymentStatus.OVERDUE]: 0,
    };

    tenants.forEach(tenant => {
        const payment = currentMonthPayments.find(p => p.tenantId === tenant.id);
        if (payment) {
            statusCounts[PaymentStatus.PAID]++;
        } else {
            const today = new Date();
            const dueDate = new Date(new Date().getFullYear(), new Date().getMonth(), tenant.paymentDay);
            if (today > dueDate) {
                statusCounts[PaymentStatus.OVERDUE]++;
            } else {
                statusCounts[PaymentStatus.PENDING]++;
            }
        }
    });

    const pieData = [
        { name: 'Pagado', value: statusCounts[PaymentStatus.PAID], color: COLORS[PaymentStatus.PAID] },
        { name: 'Pendiente', value: statusCounts[PaymentStatus.PENDING], color: COLORS[PaymentStatus.PENDING] },
        { name: 'Atrasado', value: statusCounts[PaymentStatus.OVERDUE], color: COLORS[PaymentStatus.OVERDUE] },
    ].filter(d => d.value > 0);


    // 2. Monthly Revenue (Last 6 Months)
    const getLast6MonthsData = () => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = d.toISOString().slice(0, 7);
            const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(d);

            const monthPayments = payments.filter(p => p.monthYear === monthStr && p.status === PaymentStatus.PAID);
            const revenue = monthPayments.reduce((acc, curr) => acc + curr.amount, 0);

            data.push({
                name: monthLabel,
                ingresos: revenue
            });
        }
        return data;
    };

    const revenueData = getLast6MonthsData();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Chart 1: Status Distribution */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6">Estado de Pagos (Mes Actual)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart 2: Revenue History */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6">Historial de Ingresos</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisColor }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                cursor={{ fill: isDarkMode ? '#334155' : '#F1F5F9' }}
                                contentStyle={toolTipStyle}
                            />
                            <Bar dataKey="ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;
