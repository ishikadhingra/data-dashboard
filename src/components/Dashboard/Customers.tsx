import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Input, Select, Button, Space, Tag, Spin, message, Grid } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCustomers, updateCustomerStatus } from '../../services/api.ts';
import { Customer } from '../../types/customer';

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Customers: React.FC = () => {
  const screens = useBreakpoint();
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchText, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      message.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];
    
    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    setFilteredCustomers(filtered);
  };

  const handleStatusChange = async (customerId: string, newStatus: Customer['status']) => {
    try {
      await updateCustomerStatus(customerId, newStatus);
      message.success(`Customer status updated to ${newStatus}`);
      
      // Update local state
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.customerId === customerId 
            ? { ...customer, status: newStatus } as Customer
            : customer
        )
      );
    } catch (error) {
      console.error('Failed to update customer status:', error);
      message.error('Failed to update customer status');
    }
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      sorter: (a: Customer, b: Customer) => a.customerId.localeCompare(b.customerId),
      responsive: ['sm' as const],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Customer, b: Customer) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Customer) => {
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
        
        return (
          <Select
            defaultValue={status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.customerId, value as Customer['status'])}
            size={screens.xs ? 'small' : 'middle'}
          >
            <Option value="Review">Review</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        );
      },
      filters: [
        { text: 'Review', value: 'Review' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record: Customer) => record.status === value,
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      sorter: (a: Customer, b: Customer) => a.riskScore - b.riskScore,
      render: (score: number) => {
        let color = '';
        if (score > 70) color = 'red';
        else if (score > 40) color = 'orange';
        else color = 'green';
        return <Tag color={color}>{score}</Tag>;
      },
      responsive: ['sm' as const],
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a: Customer, b: Customer) => 
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
      responsive: ['md' as const],
    },
  ];

  return (
    <div style={{ padding: screens.xs ? 4 : 16, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ fontSize: screens.xs ? 20 : 28 }}>Customers</Title>
      
      <Card className="mb-16" bodyStyle={{ padding: screens.xs ? 8 : 24 }}>
        <Space style={{ marginBottom: 16, flexWrap: 'wrap' }} direction={screens.xs ? 'vertical' : 'horizontal'}>
          <Input
            placeholder="Search by name or ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: screens.xs ? '100%' : 250 }}
            size={screens.xs ? 'small' : 'middle'}
          />
          <Select
            defaultValue="all"
            style={{ width: screens.xs ? '100%' : 150 }}
            onChange={(value) => setStatusFilter(value)}
            size={screens.xs ? 'small' : 'middle'}
          >
            <Option value="all">All Statuses</Option>
            <Option value="Review">Review</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchCustomers}
            loading={loading}
            size={screens.xs ? 'small' : 'middle'}
          >
            Refresh
          </Button>
        </Space>
        
        {loading ? (
          <div className="text-center mt-16">
            <Spin size={screens.xs ? 'small' : 'large'} />
          </div>
        ) : (
          <Table 
            dataSource={filteredCustomers} 
            columns={columns} 
            rowKey="customerId"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            size={screens.xs ? 'small' : 'middle'}
          />
        )}
      </Card>
    </div>
  );
};

export default Customers; 



// import React, { useEffect, useState } from 'react';
// import { Table, Button, Modal, Select, Form, message, Tag } from 'antd';
// import { getStoredCustomers, setStoredCustomers, updateCustomerStatusLocal } from '../../utils/localCustomerStorage.ts';
// import { Customer } from '../../types/customer';

// const { Option } = Select;

// const Customers: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [status, setStatus] = useState<Customer['status']>('Review');
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     let stored = getStoredCustomers();
//     if (stored.length === 0) {
//       // Add your mock data here
//       const mockData: Customer[] = [
//         {
//           customerId: "CUST1001",
//           name: "Bob Smith",
//           status: "Approved",
//           riskScore: 0,
//           creditScore: 700,
//           loanRepaymentHistory: [1, 1, 1, 1, 1, 1, 1, 1],
//           monthlyIncome: 8000,
//           outstandingLoans: 12000,
//           lastUpdated: new Date().toISOString(),
//         },
//         {
//           customerId: "CUST1002",
//           name: "Carol Williams",
//           status: "Review",
//           riskScore: 26,
//           creditScore: 780,
//           loanRepaymentHistory: [1, 1, 1, 1, 1, 1, 1, 0],
//           monthlyIncome: 8500,
//           outstandingLoans: 15000,
//           lastUpdated: new Date().toISOString(),
//         },
//         // Add more mock customers as needed
//       ];
//       setStoredCustomers(mockData);
//       stored = mockData;
//     }
//     setCustomers(stored);
//   }, []);

//   const showEditModal = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setStatus(customer.status);
//     setModalVisible(true);
//   };

//   const handleOk = () => {
//     if (editingCustomer) {
//       const updated = updateCustomerStatusLocal(editingCustomer.customerId, status);
//       setCustomers(updated);
//       setModalVisible(false);
//       message.success('Status updated!');
//     }
//   };

//   const handleCancel = () => {
//     setModalVisible(false);
//   };

//   const columns = [
//     {
//       title: 'Customer ID',
//       dataIndex: 'customerId',
//       key: 'customerId',
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Credit Score',
//       dataIndex: 'creditScore',
//       key: 'creditScore',
//     },
//     {
//       title: 'Monthly Income',
//       dataIndex: 'monthlyIncome',
//       key: 'monthlyIncome',
//       render: (val: number) => `$${val.toLocaleString()}`
//     },
//     {
//       title: 'Outstanding Loans',
//       dataIndex: 'outstandingLoans',
//       key: 'outstandingLoans',
//       render: (val: number) => `$${val.toLocaleString()}`
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: Customer['status']) => {
//         let color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
//         return <Tag color={color}>{status}</Tag>;
//       }
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: any, record: Customer) => (
//         <Button onClick={() => showEditModal(record)}>Edit</Button>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h2>Customers</h2>
//       <Table dataSource={customers} columns={columns} rowKey="customerId" />

//       <Modal
//         title="Edit Customer"
//         open={modalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         destroyOnClose
//       >
//         <Form layout="vertical">
//           <Form.Item label="Name">
//             <input value={editingCustomer?.name} disabled style={{ width: '100%' }} />
//           </Form.Item>
//           <Form.Item label="Status" required>
//             <Select
//               value={status}
//               onChange={val => setStatus(val as Customer['status'])}
//               style={{ width: '100%' }}
//             >
//               <Option value="Review">Review</Option>
//               <Option value="Approved">Approved</Option>
//               <Option value="Rejected">Rejected</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Customers;
