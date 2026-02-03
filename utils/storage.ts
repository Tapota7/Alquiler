
import { Tenant, Payment, OwnerProfile, ReminderConfig } from '../types';

const KEYS = {
  TENANTS: 'rentmaster_tenants',
  PAYMENTS: 'rentmaster_payments',
  OWNER: 'rentmaster_owner'
};

export const getTenants = (): Tenant[] => {
  const data = localStorage.getItem(KEYS.TENANTS);
  return data ? JSON.parse(data) : [];
};

export const saveTenants = (tenants: Tenant[]) => {
  localStorage.setItem(KEYS.TENANTS, JSON.stringify(tenants));
};

export const getPayments = (): Payment[] => {
  const data = localStorage.getItem(KEYS.PAYMENTS);
  return data ? JSON.parse(data) : [];
};

export const savePayments = (payments: Payment[]) => {
  localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
};

export const getOwnerProfile = (): OwnerProfile => {
  const data = localStorage.getItem(KEYS.OWNER);
  return data ? JSON.parse(data) : {
    name: 'Propietario Demo',
    phone: '123456789',
    email: 'admin@demo.com',
    address: 'Calle Principal 123',
    currency: '$'
  };
};


export const saveOwnerProfile = (profile: OwnerProfile) => {
  localStorage.setItem(KEYS.OWNER, JSON.stringify(profile));
};

export const getReminderConfig = (): ReminderConfig => {
  const data = localStorage.getItem('rentmaster_reminder_config');
  return data ? JSON.parse(data) : {
    enabled: false,
    daysBeforeDue: 3,
    autoSend: false,
    messageTemplate: 'Hola {nombre}, recuerde que su pago vence el {fecha}. El monto es {monto}.'
  };
};

export const saveReminderConfig = (config: ReminderConfig) => {
  localStorage.setItem('rentmaster_reminder_config', JSON.stringify(config));
};
