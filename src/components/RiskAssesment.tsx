import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import CustomerRiskCard, { RiskLevel } from "./CustomerRiskCard.tsx"
import { getCustomers } from '../services/api.ts'; // adjust path as needed
import { Customer } from '../types/customer.ts';

function calculateRiskScore(customer: Customer): number {
  // Your risk scoring logic here
  // Example: (replace with your real logic)
  const missed = Array.isArray(customer.loanRepaymentHistory)
    ? customer.loanRepaymentHistory.filter(x => x === 0).length
    : 0;
  let score = 100 - customer.creditScore / 10 - missed * 10;
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return Math.round(score);
}

function getRiskLevel(score: number): RiskLevel {
  if (score > 70) return 'High';
  if (score > 40) return 'Medium';
  return 'Low';
}

function getRiskFactors(customer: Customer, riskScore: number): string[] {
  const factors: string[] = [];
  if (customer.creditScore < 650) factors.push('Low credit score');
  if (Array.isArray(customer.loanRepaymentHistory)) {
    const missed = customer.loanRepaymentHistory.filter(x => x === 0).length;
    if (missed > 0) factors.push(`${missed} missed payments`);
  }
  if (customer.outstandingLoans / (customer.monthlyIncome * 12) > 0.5)
    factors.push('High loan to income ratio');
  return factors;
}


const RiskAssessmentDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);


  const customerData = customers.map(c => {
    const riskScore = calculateRiskScore(c);
    const riskLevel = getRiskLevel(riskScore);
    const riskFactors = getRiskFactors(c, riskScore);
    return { ...c, riskScore, riskLevel, riskFactors };
  });

  const low = customerData.filter(c => c.riskLevel === 'Low').length;
  const medium = customerData.filter(c => c.riskLevel === 'Medium').length;
  const high = customerData.filter(c => c.riskLevel === 'High').length;

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  return (
    <div>
      <h2>Risk Assessment & Scoring</h2>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Low Risk Customers" value={low} valueStyle={{ color: 'green' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Medium Risk Customers" value={medium} valueStyle={{ color: 'orange' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="High Risk Customers" value={high} valueStyle={{ color: 'red' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {customerData.map(c => (
          <Col xs={24} sm={12} md={8} key={c.customerId}>
            <CustomerRiskCard
              name={c.name}
              riskScore={c.riskScore}
              riskLevel={c.riskLevel}
              riskFactors={c.riskFactors}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RiskAssessmentDashboard;