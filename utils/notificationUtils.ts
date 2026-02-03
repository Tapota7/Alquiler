
import { Tenant, Payment, PaymentStatus } from '../types';

export const getWhatsAppLink = (phone: string, message: string) => {
    // Remove non-numeric characters from phone
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const generatePaymentReminder = (tenant: Tenant, dueDate: string) => {
    return `Hola ${tenant.fullName}, le recordamos que el pago de su alquiler vence el día ${dueDate}. Por favor, avisar al realizar la transferencia. Gracias.`;
};

export const generatePaymentReceiptMessage = (tenant: Tenant, payment: Payment) => {
    return `Hola ${tenant.fullName}, hemos recibido su pago de $${payment.amount} correspondiente a ${payment.monthYear}. Gracias!`;
};

export const generateLatePaymentMessage = (tenant: Tenant, amount: number) => {
    return `Hola ${tenant.fullName}, notamos que su pago de alquiler de $${amount} está pendiente. Por favor, regularice su situación a la brevedad.`;
};
