
import { ReminderConfig, Tenant, Payment, PaymentStatus } from '../types';

export const getPendingReminders = (
    tenants: Tenant[],
    payments: Payment[],
    config: ReminderConfig
) => {
    if (!config.enabled) return [];

    const today = new Date();
    const reminders = [];

    // Logic to find upcoming due dates
    tenants.forEach(tenant => {
        // Calculate next due date based on paymentDay
        let dueYear = today.getFullYear();
        let dueMonth = today.getMonth();

        // If today is past the payment day, check next month? 
        // Simplified logic: Check if a payment exists for current month
        const currentMonthStr = `${dueYear}-${String(dueMonth + 1).padStart(2, '0')}`;

        const hasPaid = payments.some(p =>
            p.tenantId === tenant.id &&
            p.monthYear === currentMonthStr &&
            p.status === PaymentStatus.PAID
        );

        if (!hasPaid) {
            // Calculate specific due date
            const dueDate = new Date(dueYear, dueMonth, tenant.paymentDay);
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= config.daysBeforeDue && diffDays >= 0) {
                reminders.push({
                    tenant,
                    dueDate: dueDate.toISOString(),
                    daysUntilDue: diffDays
                });
            }
        }
    });

    return reminders;
};
