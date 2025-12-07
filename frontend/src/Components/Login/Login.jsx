import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  Row,
  Col,
  Space,
  Divider,
  message,
} from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import VeggiesLogo from '../NavBar/VeggiesLogo.svg';

const { Title, Text, Paragraph } = Typography;

// Custom styles for smaller placeholder text and body margin fix
const customStyles = `
  .custom-placeholder-small input::placeholder,
  .custom-placeholder-small .ant-input::placeholder {
    font-size: 12px !important;
    color: #bfbfbf !important;
  }
  .custom-placeholder-small .ant-input-affix-wrapper input::placeholder {
    font-size: 12px !important;
    color: #bfbfbf !important;
  }
  
  /* Remove body margins when login page is active */
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Ensure AppContent has no margins */
  .AppContent {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Mobile specific adjustments */
  @media (max-width: 480px) {
    .ant-card-body {
      padding: 0!important;
    }
    
    .ant-form-item {
      margin-bottom: 16px !important;
    }
    
    .ant-typography h2, .ant-typography h3 {
      margin-bottom: 8px !important;
    }
  }
  
  /* Very small screens */
  @media (max-width: 360px) {
    .ant-card {
      margin: 8px !important;
    }
  }
`;

const Login = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const history = useHistory();
  const intl = useIntl();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.title = 'AgriManage - Login';
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  const onFinish = async values => {
    setIsSubmitting(true);
    setError('');

    try {
      const loginResponse = await axios.post('/getLogin', {
        userName: values.username,
        password: values.password,
      });

      window.sessionStorage.setItem('userName', values.username);
      message.success(
        intl.formatMessage({
          id: 'loginSuccessful',
          defaultMessage: 'Login successful! Welcome back.',
        })
      );

      // Navigate to intended page or dashboard
      const redirectTo = history.location.search.split('=')[1] || '/';
      history.push(redirectTo);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        intl.formatMessage({
          id: 'loginError',
          defaultMessage: 'Login failed. Please check your credentials.',
        });
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div
        style={{
          position: 'absolute',
          top: isMobile ? 80 : 72, // More space on mobile to clear header
          left: 0,
          right: 0,
          bottom: 64, // End at footer height (64px) to prevent white margin
          minHeight: isMobile ? 'calc(100vh - 144px)' : 'calc(100vh - 136px)', // Ensure minimum height
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center', // Start from top on mobile
          justifyContent: 'center',
          padding: isMobile ? '20px 16px 40px 16px' : '60px 40px 100px 40px',
          boxSizing: 'border-box',
          overflowY: 'auto', // Allow scrolling if content is too tall
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '1000px',
            marginTop: isMobile ? '20px' : '0',
          }}
        >
          {/* Single Professional Login Card */}
          <Card
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 24,
              border: 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
            bodyStyle={isMobile ? { padding: '0 !important' } : { padding: '0' }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: isMobile ? 'auto' : '500px',
              }}
            >
              {/* Left Panel - Branding/Welcome */}
              <div
                style={{
                  flex: isMobile ? 'none' : '1.2',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: isMobile ? '32px 24px' : '48px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Pattern */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.6,
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      width: isMobile ? 64 : 100,
                      height: isMobile ? 64 : 100,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px auto',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <img
                      src={VeggiesLogo}
                      alt="AgriManage Logo"
                      style={{
                        width: isMobile ? 36 : 56,
                        height: isMobile ? 36 : 56,
                        display: 'block',
                      }}
                    />
                  </div>

                  <Title
                    level={isMobile ? 2 : 1}
                    style={{
                      color: 'white',
                      margin: '0 0 16px 0',
                      fontWeight: 700,
                    }}
                  >
                    AgriManage
                  </Title>

                  <Title
                    level={isMobile ? 4 : 3}
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      margin: '0 0 24px 0',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage
                      id="systemName"
                      defaultMessage="Vegetable Vendor Management System"
                    />
                  </Title>

                  {!isMobile && (
                    <div>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: 16,
                          lineHeight: 1.6,
                          display: 'block',
                          marginBottom: 24,
                        }}
                      >
                        <FormattedMessage
                          id="systemDescription"
                          defaultMessage="All-in-one farmer market management system"
                        />
                      </Text>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '20px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              color: 'white',
                              fontSize: 20,
                              fontWeight: 600,
                              marginBottom: 4,
                            }}
                          >
                            500+
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: 12,
                            }}
                          >
                            Farmers
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              color: 'white',
                              fontSize: 20,
                              fontWeight: 600,
                              marginBottom: 4,
                            }}
                          >
                            50+
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: 12,
                            }}
                          >
                            Villages
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              color: 'white',
                              fontSize: 20,
                              fontWeight: 600,
                              marginBottom: 4,
                            }}
                          >
                            99%
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: 12,
                            }}
                          >
                            Uptime
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Login Form */}
              <div
                style={{
                  flex: isMobile ? 'none' : '1',
                  padding: isMobile ? '32px 24px' : '48px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ marginBottom: 32 }}>
                  <Title
                    level={2}
                    style={{
                      margin: '0 0 8px 0',
                      color: '#1a1a1a',
                      textAlign: isMobile ? 'center' : 'left',
                    }}
                  >
                    <FormattedMessage id="welcome" defaultMessage="Welcome Back" />
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 16,
                      textAlign: isMobile ? 'center' : 'left',
                      display: 'block',
                    }}
                  >
                    <FormattedMessage
                      id="loginSubtitle"
                      defaultMessage="Sign in to access your dashboard"
                    />
                  </Text>
                </div>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError('')}
                    style={{ marginBottom: 24, borderRadius: 12 }}
                  />
                )}

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    label={
                      <Text strong style={{ fontSize: 14 }}>
                        <FormattedMessage id="username" defaultMessage="Username" />
                      </Text>
                    }
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'usernameError',
                          defaultMessage: 'Please enter your username',
                        }),
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder={intl.formatMessage({
                        id: 'usernamePlaceholder',
                        defaultMessage: 'Enter your username',
                      })}
                      style={{
                        borderRadius: 12,
                        fontSize: '14px',
                        height: 48,
                        border: '2px solid #f0f0f0',
                        transition: 'all 0.3s ease',
                      }}
                      className="custom-placeholder-small"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <Text strong style={{ fontSize: 14 }}>
                        <FormattedMessage id="password" defaultMessage="Password" />
                      </Text>
                    }
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'passwordError',
                          defaultMessage: 'Please enter your password',
                        }),
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder={intl.formatMessage({
                        id: 'passwordPlaceholder',
                        defaultMessage: 'Enter your password',
                      })}
                      style={{
                        borderRadius: 12,
                        fontSize: '14px',
                        height: 48,
                        border: '2px solid #f0f0f0',
                        transition: 'all 0.3s ease',
                      }}
                      className="custom-placeholder-small"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                      icon={<LoginOutlined />}
                      size="large"
                      block
                      style={{
                        height: 52,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <FormattedMessage id="signin" defaultMessage="Sign In" />
                    </Button>
                  </Form.Item>
                </Form>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: 24,
                    paddingTop: 24,
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <FormattedMessage
                      id="secureLoginFooter"
                      defaultMessage="🔒 Secure & encrypted connection"
                    />
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Mobile Additional Info */}
          {isMobile && (
            <div
              style={{
                textAlign: 'center',
                marginTop: 16,
                padding: '16px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 16,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                <FormattedMessage
                  id="mobileOptimized"
                  defaultMessage="Optimized for mobile • Best in landscape"
                />
              </Text>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
