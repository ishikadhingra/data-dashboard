import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, theme, Switch, Space, Typography, ConfigProvider } from 'antd';
import {
  DashboardOutlined,
  AlertOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  RobotOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { ThemeConfig } from 'antd/es/config-provider';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Create a context for theme
export const ThemeContext = React.createContext<{
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}>({
  isDarkMode: false,
  setIsDarkMode: () => {},
});

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG, colorText },
  } = theme.useToken();

  const darkTheme: ThemeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      colorText: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.85)',
      colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
      colorBgElevated: isDarkMode ? '#1f1f1f' : '#ffffff',
      colorBgLayout: isDarkMode ? '#000000' : '#f0f2f5',
    },
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard Overview',
    },
    {
      key: '/risk-assessment',
      icon: <SafetyCertificateOutlined />,
      label: 'Risk Assessment',
    },
    {
      key: '/workflow-automation',
      icon: <RobotOutlined />,
      label: 'Workflow Automation',
    },
    {
      key: '/alerts',
      icon: <AlertOutlined />,
      label: 'Alerts',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 767) {
      setCollapsed(true);
      setShowMobileOverlay(false);
    }
  };

  // Handle sidebar toggle for mobile
  const handleSidebarToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    setShowMobileOverlay(!newCollapsed);
  };

  // Close sidebar and overlay on mobile
  const handleOverlayClick = () => {
    setCollapsed(true);
    setShowMobileOverlay(false);
  };

  // Listen for window resize to hide overlay if needed
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setShowMobileOverlay(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ConfigProvider theme={darkTheme}>
        <Layout style={{ minHeight: '100vh', background: isDarkMode ? '#141414' : '#f0f2f5' }}>
          {/* Sidebar */}
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={isDarkMode ? "dark" : "light"}
            style={{
              zIndex: showMobileOverlay ? 1100 : undefined,
              position: window.innerWidth <= 767 ? 'fixed' : 'relative',
              height: '100vh',
              left: collapsed && window.innerWidth <= 767 ? -200 : 0,
              transition: 'all 0.2s',
              background: isDarkMode ? '#141414' : '#ffffff'
            }}
          >
            <div style={{
              textAlign: 'center',
              padding: '48px 8px 24px 8px',
              fontSize: collapsed ? '18px' : '20px',
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#000000',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'all 0.3s',
              minHeight: 56
            }}>
              {collapsed ? 'DD' : 'Data Dashboard'}
            </div>
            <Menu
              theme={isDarkMode ? "dark" : "light"}
              mode="inline"
              defaultSelectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => handleMenuClick(key)}
              style={{ background: isDarkMode ? '#141414' : '#ffffff' }}
            />
          </Sider>
          {/* Mobile overlay */}
          {showMobileOverlay && (
            <div
              onClick={handleOverlayClick}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1099,
                transition: 'background 0.2s',
              }}
            />
          )}
          <Layout style={{ background: isDarkMode ? '#141414' : '#f0f2f5' }}>
            <Header style={{ 
              padding: 0, 
              background: isDarkMode ? '#141414' : '#ffffff', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              color: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.85)',
              borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={handleSidebarToggle}
                  style={{
                    fontSize: '22px',
                    width: 48,
                    height: 48,
                    marginLeft: 8,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 1200,
                    color: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.85)'
                  }}
                  aria-label="Toggle sidebar"
                />
                <Title level={4} style={{ 
                  margin: 0, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  fontSize: 20,
                  color: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.85)'
                }}>Data Dashboard</Title>
              </div>
              <Space style={{ marginRight: 16 }}>
                <Switch
                  checked={isDarkMode}
                  onChange={setIsDarkMode}
                  checkedChildren={<BulbFilled />}
                  unCheckedChildren={<BulbOutlined />}
                />
              </Space>
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                borderRadius: borderRadiusLG,
                minHeight: 280,
                color: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.85)',
                boxShadow: isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default DashboardLayout; 