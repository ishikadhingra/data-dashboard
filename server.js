const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
const customers = [
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

// API Routes
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.put('/api/customers/:customerId/status', (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;
  
  const customerIndex = customers.findIndex(c => c.customerId === customerId);
  
  if (customerIndex === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  
  customers[customerIndex].status = status;
  customers[customerIndex].lastUpdated = new Date().toISOString();
  
  res.json(customers[customerIndex]);
});

app.post('/api/alerts', (req, res) => {
  const { customerId, riskScore } = req.body;
  
  // In a real app, this would save to a database
  console.log(`Alert created for customer ${customerId} with risk score ${riskScore}`);
  
  res.status(201).json({ message: 'Alert created successfully' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 