import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, Typography, Divider, message, Tabs } from 'antd';
import { SaveOutlined, UserOutlined, BellOutlined, LockOutlined, ApiOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveSettings = async (values: any) => {
    try {
      setLoading(true);
      // In a real app, this would call an API to save settings
      console.log('Saving settings:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-16">
      <Title level={2}>Settings</Title>
      
      <Card className="mb-16">
        <Tabs defaultActiveKey="general">
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                General
              </span>
            } 
            key="general"
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                companyName: 'KYC Hub',
                email: 'admin@kychub.com',
                timezone: 'UTC',
                dateFormat: 'MM/DD/YYYY',
                enableNotifications: true
              }}
              onFinish={handleSaveSettings}
            >
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Admin Email"
                rules={[
                  { required: true, message: 'Please enter admin email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter admin email" />
              </Form.Item>
              
              <Form.Item
                name="timezone"
                label="Timezone"
              >
                <Select placeholder="Select timezone">
                  <Option value="UTC">UTC</Option>
                  <Option value="EST">Eastern Time (EST)</Option>
                  <Option value="CST">Central Time (CST)</Option>
                  <Option value="MST">Mountain Time (MST)</Option>
                  <Option value="PST">Pacific Time (PST)</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="dateFormat"
                label="Date Format"
              >
                <Select placeholder="Select date format">
                  <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                  <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                  <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="enableNotifications"
                label="Enable Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />} 
                  loading={loading}
                >
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            } 
            key="notifications"
          >
            <Form layout="vertical">
              <Form.Item
                label="Email Notifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                label="High Risk Alerts"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                label="Document Expiry Alerts"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                label="Unusual Activity Alerts"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />}>
                  Save Notification Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <LockOutlined />
                Security
              </span>
            } 
            key="security"
          >
            <Form layout="vertical">
              <Form.Item
                label="Two-Factor Authentication"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                label="Session Timeout (minutes)"
                initialValue={30}
              >
                <Input type="number" min={5} max={120} />
              </Form.Item>
              
              <Form.Item
                label="Password Policy"
              >
                <Select defaultValue="medium">
                  <Option value="low">Low (minimum 8 characters)</Option>
                  <Option value="medium">Medium (minimum 8 characters, 1 uppercase, 1 number)</Option>
                  <Option value="high">High (minimum 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)</Option>
                </Select>
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />}>
                  Save Security Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                API
              </span>
            } 
            key="api"
          >
            <Card title="API Keys" className="mb-16">
              <Text>Your API keys allow external applications to access your KYC Hub data.</Text>
              <div style={{ marginTop: 16 }}>
                <Button type="primary">Generate New API Key</Button>
              </div>
            </Card>
            
            <Card title="Webhooks">
              <Text>Configure webhooks to receive real-time notifications when events occur in your account.</Text>
              <div style={{ marginTop: 16 }}>
                <Button type="primary">Add Webhook</Button>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings; 