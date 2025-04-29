import axios from 'axios';
import { Customer } from '../types/customer';

// In a real application, this would be an environment variable
const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const mockCustomers: Customer[] = [
  {
    customerId: 'CUST001',
    name: 'John Doe',
    status: 'Review',
    riskScore: 85,
    creditScore: 650,
    loanRepaymentHistory: 'Poor',
    monthlyIncome: 5000,
    outstandingLoans: 25000,
    lastUpdated: '2023-04-28T10:30:00Z'
  },
  {
    customerId: 'CUST002',
    name: 'Jane Smith',
    status: 'Approved',
    riskScore: 25,
    creditScore: 780,
    loanRepaymentHistory: 'Excellent',
    monthlyIncome: 8500,
    outstandingLoans: 15000,
    lastUpdated: '2023-04-27T14:15:00Z'
  },
  {
    customerId: 'CUST003',
    name: 'Robert Johnson',
    status: 'Rejected',
    riskScore: 65,
    creditScore: 620,
    loanRepaymentHistory: 'Fair',
    monthlyIncome: 4200,
    outstandingLoans: 30000,
    lastUpdated: '2023-04-26T09:45:00Z'
  },
  {
    customerId: 'CUST004',
    name: 'Emily Davis',
    status: 'Approved',
    riskScore: 15,
    creditScore: 820,
    loanRepaymentHistory: 'Excellent',
    monthlyIncome: 12000,
    outstandingLoans: 5000,
    lastUpdated: '2023-04-25T16:20:00Z'
  },
  {
    customerId: 'CUST005',
    name: 'Michael Wilson',
    status: 'Review',
    riskScore: 75,
    creditScore: 580,
    loanRepaymentHistory: 'Poor',
    monthlyIncome: 3800,
    outstandingLoans: 45000,
    lastUpdated: '2023-04-24T11:10:00Z'
  }
];

// API functions
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get('/customers');
    // return response.data;
    
    // For development, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCustomers);
      }, 500); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const updateCustomerStatus = async (customerId: string, status: Customer['status']): Promise<Customer> => {
  try {
    // In a real app, this would be an API call
    // const response = await api.put(`/customers/${customerId}/status`, { status });
    // return response.data;
    
    // For development, update mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedCustomer = {
          ...mockCustomers.find(c => c.customerId === customerId)!,
          status,
          lastUpdated: new Date().toISOString()
        };
        
        // Update the mock data
        const index = mockCustomers.findIndex(c => c.customerId === customerId);
        if (index !== -1) {
          mockCustomers[index] = updatedCustomer;
        }
        
        resolve(updatedCustomer);
      }, 300); // Simulate network delay
    });
  } catch (error) {
    console.error('Error updating customer status:', error);
    throw error;
  }
};

export const createAlert = async (customerId: string, riskScore: number): Promise<void> => {
  try {
    // In a real app, this would be an API call
    // await api.post('/alerts', { customerId, riskScore });
    
    // For development, just log
    console.log(`Alert created for customer ${customerId} with risk score ${riskScore}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300); // Simulate network delay
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export default {
  getCustomers,
  updateCustomerStatus,
  createAlert
}; 