export interface Customer {
  customerId: string;
  name: string;
  status: 'Review' | 'Approved' | 'Rejected';
  riskScore: number;
  creditScore: number;
  loanRepaymentHistory: 'Poor' | 'Fair' | 'Good' | 'Excellent' | number[];
  monthlyIncome: number;
  outstandingLoans: number;
  lastUpdated: string;
} 