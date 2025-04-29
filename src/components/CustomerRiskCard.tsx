import React from 'react';
import { Card, Progress, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export type RiskLevel = 'Low' | 'Medium' | 'High';

interface CustomerRiskCardProps {
  name: string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
}

const riskColor = {
  Low: 'green',
  Medium: 'orange',
  High: 'red',
};

const CustomerRiskCard: React.FC<CustomerRiskCardProps> = ({ name, riskScore, riskLevel, riskFactors }) => (
  <Card style={{ minWidth: 300, margin: 8 }}>
    <Title level={4}>{name}</Title>
    <Progress
      type="circle"
      percent={riskScore}
      strokeColor={riskColor[riskLevel]}
      format={percent => `${percent}%`}
      width={80}
    />
    <div style={{ margin: '12px 0' }}>
      <Tag color={riskColor[riskLevel]}>{riskLevel} Risk</Tag>
    </div>
    <Paragraph strong>Risk Factors:</Paragraph>
    <ul>
      {riskFactors.length === 0
        ? <li>No significant risk factors identified</li>
        : riskFactors.map((factor, idx) => <li key={idx}>{factor}</li>)
      }
    </ul>
  </Card>
);

export default CustomerRiskCard;