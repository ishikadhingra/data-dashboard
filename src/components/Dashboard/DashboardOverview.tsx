import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Spin } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { getCustomers } from '../../services/api.ts';
import { Customer } from '../../types/customer';

const { Title } = Typography;

const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      
      // Calculate statistics
      const approved = data.filter(c => c.status === 'Approved').length;
      const pending = data.filter(c => c.status === 'Review').length;
      const rejected = data.filter(c => c.status === 'Rejected').length;
      
      setStats({
        total: data.length,
        approved,
        pending,
        rejected
      });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status) {
          case 'Approved':
            color = 'green';
            break;
          case 'Rejected':
            color = 'red';
            break;
          default:
            color = 'orange';
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => {
        let color = '';
        if (score > 70) color = 'red';
        else if (score > 40) color = 'orange';
        else color = 'green';
        return <span style={{ color }}>{score}</span>;
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
  ];

  return (
    <div className="p-16">
      <Title level={2}>Dashboard Overview</Title>
      
      {loading ? (
        <div className="text-center mt-16">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-16">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Customers"
                  value={stats.total}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Approved"
                  value={stats.approved}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending Review"
                  value={stats.pending}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Rejected"
                  value={stats.rejected}
                  prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Card title="Recent Customers">
            <Table 
              dataSource={customers.slice(0, 5)} 
              columns={columns} 
              rowKey="customerId"
              pagination={false}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardOverview; 