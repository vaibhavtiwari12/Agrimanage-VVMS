import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Card, Button } from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { EllipsisText } from '../Common';
import ReportTab from './ReportTab';

const { Title } = Typography;

const Report = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileOrTablet(isMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExportReport = () => {
    // This will be handled by the active tab component
    const event = new CustomEvent('exportReport');
    window.dispatchEvent(event);
  };

  return (
    <div className="report-page ant-page-bg" style={{ minHeight: '100vh', padding: '0 0 32px 0' }}>
      <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
        <Breadcrumb.Item>
          <Link className="link-no-decoration-black text-primary" to="/">
            <FormattedMessage id="navigation.home" defaultMessage="Home" />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="navigation.report" defaultMessage="Report" />
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header Section */}
      <Card
        style={{
          margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        }}
        bodyStyle={{ padding: isMobileOrTablet ? 16 : 24 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: isMobileOrTablet ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: isMobileOrTablet ? 'column' : 'row',
            gap: isMobileOrTablet ? 16 : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: isMobileOrTablet ? '100%' : 'auto',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: isMobileOrTablet ? 8 : 12,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileTextOutlined style={{ fontSize: isMobileOrTablet ? 18 : 24, color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: isMobileOrTablet ? 16 : 20,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 4,
                }}
              >
                <FormattedMessage id="report.title" defaultMessage="Reports" />
              </div>
              {!isMobileOrTablet && (
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <FormattedMessage
                    id="report.description"
                    defaultMessage="Financial reports and analytics"
                  />
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              width: isMobileOrTablet ? '100%' : 'auto',
              justifyContent: isMobileOrTablet ? 'flex-end' : 'flex-start',
              alignItems: 'center',
            }}
          >
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={isMobileOrTablet ? 'middle' : 'large'}
              style={{
                fontWeight: 600,
                borderRadius: 8,
                backgroundColor: '#fff',
                borderColor: '#fff',
                color: '#667eea',
                fontSize: isMobileOrTablet ? 14 : 16,
              }}
              onClick={handleExportReport}
            >
              <FormattedMessage id="report.exportReport" defaultMessage="Export Report" />
            </Button>
          </div>
        </div>
      </Card>

      <div style={{ margin: isMobileOrTablet ? '0 12px' : '0 24px' }}>
        <ReportTab />
      </div>
    </div>
  );
};

export default Report;
