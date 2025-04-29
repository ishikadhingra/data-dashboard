import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import DashboardLayout from "./components/Dashboard/DashboardLayout.tsx";
import WorkflowAutomation from "./components/WorkflowAutomation.tsx";
import RiskAssessmentDashboard from './components/RiskAssesment.tsx';

// Import pages
import DashboardOverview from './components/Dashboard/DashboardOverview.tsx';
import Customers from './components/Dashboard/Customers.tsx';
import Analytics from './components/Dashboard/Analytics.tsx';
import Alerts from './components/Dashboard/Alerts.tsx';
import Settings from './components/Dashboard/Settings.tsx';
import { Customer } from './types/customer.ts';

const App: React.FC = () => {
  
const customer = {
  customerId: "CUST1001",
  name: "Alice Johnson",
  status: "Review",
  riskScore: 75,
  creditScore: 710,
  loanRepaymentHistory: [1, 0, 1, 1, 1, 1, 0, 1],
  monthlyIncome: 6200,
  outstandingLoans: 15000,
  lastUpdated: "2023-04-28T10:30:00Z"
};

// const typedCustomer: Customer = {
//   ...customer,
//   status: customer.status as "Review" | "Approved" | "Rejected"
// };

  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="workflow-automation" element={<WorkflowAutomation />} />
          <Route path="risk-assessment" element={<RiskAssessmentDashboard />} />
          {/* <Route path="risk-assessment" element={<RiskAssessment customer={typedCustomer}} > */}
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App; 