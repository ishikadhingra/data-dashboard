import { Customer } from '../types/customer';

const STORAGE_KEY = 'customers';

export function getStoredCustomers(): Customer[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function setStoredCustomers(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function updateCustomerStatusLocal(customerId: string, status: Customer['status']) {
  const customers = getStoredCustomers();
  const updated = customers.map(c =>
    c.customerId === customerId ? { ...c, status } : c
  );
  setStoredCustomers(updated);
  return updated;
}