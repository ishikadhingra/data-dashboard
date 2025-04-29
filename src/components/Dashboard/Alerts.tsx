import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Button, Space, Spin, Empty, Modal, Form, Input, Select, message } from 'antd';
import { 
  ExclamationCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getCustomers, createAlert } from "../../services/api.ts"
import { Customer } from '../../types/customer';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Alert {
  id: string;
  customerId: string;
  customerName: string;
  type: 'high_risk' | 'document_expiry' | 'unusual_activity' | 'custom';
  severity: 'high' | 'medium' | 'low';
  message: string;
  createdAt: string;
  status: 'active' | 'resolved' | 'dismissed';
}

const Alerts: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
    // In a real app, this would fetch from an API
    // For now, we'll generate some mock alerts
    generateMockAlerts();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAlerts = () => {
    // This would be replaced with an API call in a real app
    const mockAlerts: Alert[] = [
      {
        id: '1',
        customerId: 'CUST001',
        customerName: 'John Doe',
        type: 'high_risk',
        severity: 'high',
        message: 'Customer has a high risk score of 85. Immediate review required.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'active'
      },
      {
        id: '2',
        customerId: 'CUST003',
        customerName: 'Jane Smith',
        type: 'document_expiry',
        severity: 'medium',
        message: 'Customer\'s ID document will expire in 30 days.',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'active'
      },
      {
        id: '3',
        customerId: 'CUST005',
        customerName: 'Robert Johnson',
        type: 'unusual_activity',
        severity: 'high',
        message: 'Unusual transaction pattern detected for this customer.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'resolved'
      }
    ];
    
    setAlerts(mockAlerts);
  };

  const handleCreateAlert = async (values: any) => {
    try {
      // In a real app, this would call an API
      // For now, we'll just add to our local state
      const newAlert: Alert = {
        id: Date.now().toString(),
        customerId: values.customerId,
        customerName: customers.find(c => c.customerId === values.customerId)?.name || 'Unknown',
        type: values.type,
        severity: values.severity,
        message: values.message,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      setAlerts([newAlert, ...alerts]);
      message.success('Alert created successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create alert:', error);
      message.error('Failed to create alert');
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'dismissed' } : alert
    ));
    message.success('Alert dismissed');
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
    message.success('Alert resolved');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'resolved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'dismissed':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-16">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Alerts</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
        >
          Create Alert
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center mt-16">
          <Spin size="large" />
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <Empty description="No alerts found" />
        </Card>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={alerts}
          renderItem={alert => (
            <Card className="mb-16">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Space>
                    {getStatusIcon(alert.status)}
                    <Title level={4} style={{ margin: 0 }}>
                      {alert.customerName} ({alert.customerId})
                    </Title>
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Tag>
                    <Tag color="blue">{alert.type.replace('_', ' ').toUpperCase()}</Tag>
                    <Tag color={alert.status === 'active' ? 'red' : alert.status === 'resolved' ? 'green' : 'orange'}>
                      {alert.status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
                <Text type="secondary">
                  {new Date(alert.createdAt).toLocaleString()}
                </Text>
              </div>
              <Text style={{ marginTop: 16, display: 'block' }}>
                {alert.message}
              </Text>
              {alert.status === 'active' && (
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <Button 
                    type="primary" 
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </Card>
          )}
        />
      )}
      
      <Modal
        title="Create Alert"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAlert}
        >
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select placeholder="Select a customer">
              {customers.map(customer => (
                <Option key={customer.customerId} value={customer.customerId}>
                  {customer.name} ({customer.customerId})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Alert Type"
            rules={[{ required: true, message: 'Please select an alert type' }]}
          >
            <Select placeholder="Select alert type">
              <Option value="high_risk">High Risk</Option>
              <Option value="document_expiry">Document Expiry</Option>
              <Option value="unusual_activity">Unusual Activity</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: 'Please select severity' }]}
          >
            <Select placeholder="Select severity">
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter a message' }]}
          >
            <TextArea rows={4} placeholder="Enter alert message" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Alert
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Alerts; 