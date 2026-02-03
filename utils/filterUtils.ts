
import { Tenant, Payment, FilterCriteria } from '../types';

export const filterPayments = (payments: Payment[], criteria: FilterCriteria): Payment[] => {
    return payments.filter(payment => {
        // Status Filter
        if (criteria.status && criteria.status.length > 0 && !criteria.status.includes(payment.status)) {
            return false;
        }

        // Date Range Filter
        if (criteria.dateRange) {
            const payDate = new Date(payment.date);
            const start = new Date(criteria.dateRange.start);
            const end = new Date(criteria.dateRange.end);
            if (payDate < start || payDate > end) return false;
        }

        // Amount Range Filter
        if (criteria.amountRange) {
            if (payment.amount < criteria.amountRange.min || payment.amount > criteria.amountRange.max) return false;
        }

        return true;
    });
};

export const filterTenants = (tenants: Tenant[], query: string): Tenant[] => {
    if (!query) return tenants;
    const lowerQuery = query.toLowerCase();
    return tenants.filter(tenant =>
        tenant.fullName.toLowerCase().includes(lowerQuery) ||
        tenant.email.toLowerCase().includes(lowerQuery) ||
        tenant.address.toLowerCase().includes(lowerQuery)
    );
};
