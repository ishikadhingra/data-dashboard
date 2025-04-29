import React from "react";
import { Card, Select, Row, Col, message, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import { Customer } from "../types/customer";
import { getCustomers, updateCustomerStatus, createAlert } from "../services/api.ts";
import { calculateRiskScore } from "../utils/riskScoreCalculator.ts";
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

// ===== AI-ASSISTED COMPONENT ENHANCEMENT =====
// This component was enhanced with AI assistance to improve the workflow automation
// and to integrate with the localStorage-based API service

const WorkflowAutomation = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertModalVisible, setAlertModalVisible] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // AI-suggested implementation for fetching customers from localStorage
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      message.error("Failed to fetch customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // AI-assisted implementation for status updates with localStorage
  const handleStatusChange = async (customerId: string, newStatus: "Approved" | "Rejected" | "Review") => {
    try {
      const updatedCustomer = await updateCustomerStatus(customerId, newStatus);
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.customerId === customerId ? updatedCustomer : customer
        )
      );
      
      // Enhanced toast notifications with different styles based on status
      switch(newStatus) {
        case "Approved":
          message.success({
            content: "Customer status has been successfully approved",
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            duration: 3
          });
          break;
        case "Rejected":
          message.error({
            content: "Customer status has been rejected",
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            duration: 3
          });
          break;
        case "Review":
          message.info({
            content: "Customer is now under review",
            icon: <EyeOutlined style={{ color: '#1890ff' }} />,
            duration: 3
          });
          break;
        default:
          message.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      message.error("Failed to update status");
      console.error(error);
    }
  };

  // AI-suggested implementation for alert modal handling
  const handleAlertClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAlertModalVisible(true);
  };

  // AI-assisted implementation for creating alerts
  const handleCreateAlert = async () => {
    if (!selectedCustomer) return;
    
    const riskScore = calculateRiskScore(
      selectedCustomer.creditScore,
      selectedCustomer.loanRepaymentHistory,
      selectedCustomer.monthlyIncome,
      selectedCustomer.outstandingLoans
    );
    
    try {
      await createAlert(selectedCustomer.customerId, riskScore);
      message.success({
        content: "Alert created successfully",
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 3
      });
      setAlertModalVisible(false);
    } catch (error) {
      message.error("Failed to create alert");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Workflow Automation</h2>
      <Row gutter={[16, 16]}>
        {customers.map((customer) => {
          const riskScore = calculateRiskScore(
            customer.creditScore,
            customer.loanRepaymentHistory,
            customer.monthlyIncome,
            customer.outstandingLoans
          );
          
          const isHighRisk = riskScore > 70;
          
          return (
            <Col xs={24} sm={12} md={8} key={customer.customerId} style={{ marginBottom: 16 }}>
              <Card 
                title={customer.name}
                extra={isHighRisk && (
                  <Button 
                    type="primary" 
                    danger 
                    size="small"
                    onClick={() => handleAlertClick(customer)}
                    style={{ minWidth: 90, width: '100%' }}
                  >
                    Alert
                  </Button>
                )}
                bodyStyle={{ padding: 16 }}
                style={{ minHeight: 220 }}
              >
                <p>Current Status: <strong>{customer.status}</strong></p>
                <p>Risk Score: <strong>{Math.round(riskScore)}</strong></p>
                <Select
                  defaultValue={customer.status}
                  style={{ width: '100%', maxWidth: 220 }}
                  onChange={(value) => handleStatusChange(customer.customerId, value)}
                  dropdownStyle={{ minWidth: 120 }}
                >
                  <Option value="Review">Review</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Rejected">Rejected</Option>
                </Select>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title="Create Alert"
        open={alertModalVisible}
        onOk={handleCreateAlert}
        onCancel={() => setAlertModalVisible(false)}
        bodyStyle={{ padding: 16 }}
        style={{ maxWidth: 400, width: '95vw', margin: '0 auto' }}
      >
        {selectedCustomer && (
          <div>
            <p>Are you sure you want to create an alert for <strong>{selectedCustomer.name}</strong>?</p>
            <p>This customer has a high risk score and may require immediate attention.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkflowAutomation;
