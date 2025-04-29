import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, DatePicker, Select } from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getCustomers } from '../../services/api.ts';
import { Customer } from '../../types/customer';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [timeRange, setTimeRange] = useState<string>('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      processData();
    }
  }, [customers, timeRange]);

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

  const processData = () => {
    // Process data for bar chart
    const statusCounts = {
      Review: 0,
      Approved: 0,
      Rejected: 0
    };
    
    customers.forEach(customer => {
      statusCounts[customer.status as keyof typeof statusCounts]++;
    });
    
    const barData = [
      { name: 'Review', count: statusCounts.Review },
      { name: 'Approved', count: statusCounts.Approved },
      { name: 'Rejected', count: statusCounts.Rejected }
    ];
    
    setChartData(barData);
    
    // Process data for pie chart
    const riskRanges = {
      'Low Risk (0-40)': 0,
      'Medium Risk (41-70)': 0,
      'High Risk (71-100)': 0
    };
    
    customers.forEach(customer => {
      if (customer.riskScore <= 40) {
        riskRanges['Low Risk (0-40)']++;
      } else if (customer.riskScore <= 70) {
        riskRanges['Medium Risk (41-70)']++;
      } else {
        riskRanges['High Risk (71-100)']++;
      }
    });
    
    const pieChartData = Object.entries(riskRanges).map(([name, value]) => ({
      name,
      value
    }));
    
    setPieData(pieChartData);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <div className="p-16">
      <Title level={2}>Analytics</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Select 
          defaultValue="week" 
          style={{ width: 120 }} 
          onChange={handleTimeRangeChange}
        >
          <Option value="day">Today</Option>
          <Option value="week">This Week</Option>
          <Option value="month">This Month</Option>
          <Option value="year">This Year</Option>
        </Select>
      </div>
      
      {loading ? (
        <div className="text-center mt-16">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Customer Status Distribution">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Risk Score Distribution">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Analytics; 