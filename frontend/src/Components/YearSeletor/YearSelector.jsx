import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Card, Select, Typography, Space, Spin, Empty, message } from 'antd';
import { CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import YearContext from '../../Context/YearContext.js';

const { Title, Text } = Typography;
const { Option } = Select;

// Custom styles to remove body margins when year selector is active
const customStyles = `
  /* Remove body margins when year selector page is active */
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Ensure AppContent has no margins */
  .AppContent {
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const YearSelector = () => {
  const [loadingMessage, setLoadingMessage] = useState('Loading');
  const history = useHistory();
  const { year, onSetYear, yearOptions, isYearLoading } = useContext(YearContext);
  const intl = useIntl();

  const loadingMessages = ['Loading', 'Almost there', 'Please wait'];

  // Rotate loading messages while loading year options
  React.useEffect(() => {
    if (!isYearLoading) return;

    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 1500); // Change message every 1.5 seconds

    return () => clearInterval(interval);
  }, [isYearLoading]);

  const onClickYearHandler = async changedYear => {
    try {
      await axios.post('/yearChange', { year: changedYear });
      onSetYear(changedYear);
      message.success(
        intl.formatMessage({
          id: 'yearChangedSuccessfully',
          defaultMessage: 'Year changed successfully',
        })
      );
      setTimeout(() => {
        history.push('/');
      }, 1000);
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'failedToChangeYear',
          defaultMessage: 'Failed to change year',
        })
      );
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div
        style={{
          position: 'absolute',
          top: 72, // Start below navbar (72px height)
          left: 0,
          right: 0,
          bottom: 42, // End at footer height (64px) to prevent white margin
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 24px 76px 24px', // Added bottom padding for gap with footer
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <CalendarOutlined
                  style={{
                    fontSize: 36,
                    color: '#667eea',
                    marginBottom: 12,
                  }}
                />
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: '#262626',
                    fontWeight: 600,
                  }}
                >
                  <FormattedMessage id="selectYearTitle" defaultMessage="Select Year" />
                </Title>
              </div>

              <div style={{ width: '100%' }}>
                <Text
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    color: '#595959',
                    fontWeight: 500,
                  }}
                >
                  <FormattedMessage id="yearTitle" defaultMessage="Year" />
                </Text>

                {isYearLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      background: '#f5f5f5',
                      borderRadius: 8,
                      minHeight: '120px',
                    }}
                  >
                    <Spin size="large" />
                    <Text
                      style={{
                        marginTop: 16,
                        fontSize: 16,
                        color: '#667eea',
                        fontWeight: 500,
                      }}
                    >
                      {loadingMessage}...
                    </Text>
                  </div>
                ) : (
                  <Select
                    size="default"
                    style={{ width: '100%' }}
                    placeholder={intl.formatMessage({
                      id: 'selectYear',
                      defaultMessage: 'Select Year',
                    })}
                    value={year}
                    onChange={onClickYearHandler}
                    suffixIcon={<CalendarOutlined />}
                    notFoundContent={
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <FormattedMessage
                            id="noYearsAvailable"
                            defaultMessage="No years available"
                          />
                        }
                      />
                    }
                  >
                    {yearOptions && yearOptions.length > 0
                      ? yearOptions.map(option => (
                          <Option key={option} value={option}>
                            <Space>
                              <CalendarOutlined />
                              {option}
                              {option === year && (
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                              )}
                            </Space>
                          </Option>
                        ))
                      : null}
                  </Select>
                )}
              </div>

              {year && (
                <Card
                  size="small"
                  style={{
                    background: '#f0f2ff',
                    border: '1px solid #d6e4ff',
                    borderRadius: 8,
                  }}
                >
                  <Space>
                    <CheckCircleOutlined style={{ color: '#1890ff' }} />
                    <Text strong style={{ color: '#1890ff' }}>
                      <FormattedMessage id="currentYear" defaultMessage="Current Year" />: {year}
                    </Text>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
        </div>
      </div>
    </>
  );
};

export default YearSelector;
