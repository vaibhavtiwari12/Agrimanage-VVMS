import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, Button, Spin, Typography, Breadcrumb, Space, Alert, message } from 'antd';
import { HomeOutlined, ShopOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { SimpleShimmer } from '../Common';
import axios from 'axios';
import InventoryTable from './InventoryTable';
import InventoryTabs from './InventoryTabs';

const { Title, Text } = Typography;

const InventoryLanding = () => {
  const history = useHistory();
  const intl = useIntl();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);

  const handleAddInventoryType = useCallback(() => {
    history.push('/addInventoryType');
  }, [history]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.title = 'VVMS - Inventory';

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const inventoryData = await axios.get('/inventory/get');
        setInventory(inventoryData.data || []);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        const errorMessage = intl.formatMessage({
          id: 'inventory.fetchError',
          defaultMessage: 'Failed to load inventory data',
        });
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.log('Inventory', inventory);
  }, [inventory]);

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 32px 0' }}>
      {/* Breadcrumb - Outside any card */}
      <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
        <Breadcrumb.Item>
          <Link to="/">
            <FormattedMessage id="home" defaultMessage="Home" />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="inventory" defaultMessage="Inventory" />
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header Section with Gradient */}
      <Card
        style={{
          margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        }}
        bodyStyle={{ padding: isMobileOrTablet ? 16 : 24 }}
      >
        {/* Title and Action Button */}
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
              <AppstoreOutlined style={{ fontSize: isMobileOrTablet ? 18 : 24, color: '#fff' }} />
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
                <FormattedMessage
                  id="inventoryLandingTitle"
                  defaultMessage="Inventory Management"
                />
              </div>
              {!isMobileOrTablet && (
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <FormattedMessage
                    id="inventoryDescription"
                    defaultMessage="Manage your inventory items and track transactions"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              width: isMobileOrTablet ? '100%' : 'auto',
              display: isMobileOrTablet ? 'flex' : undefined,
              justifyContent: isMobileOrTablet ? 'flex-end' : undefined,
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddInventoryType}
              style={{
                height: isMobileOrTablet ? '40px' : '44px',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: 8,
                paddingLeft: isMobileOrTablet ? 12 : 24,
                paddingRight: isMobileOrTablet ? 12 : 24,
                backgroundColor: '#fff',
                borderColor: '#fff',
                color: '#667eea',
                width: isMobileOrTablet ? 'fit-content' : 'auto',
                minWidth: isMobileOrTablet ? 0 : undefined,
                alignSelf: isMobileOrTablet ? 'flex-end' : undefined,
              }}
            >
              <FormattedMessage id="addfasalType" defaultMessage="Add Fasal Type" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert
          message={<FormattedMessage id="common.error" defaultMessage="Error" />}
          description={error}
          type="error"
          style={{
            margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px',
          }}
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

      {/* Loading State */}
      {isLoading && <SimpleShimmer />}

      {/* Content Section */}
      {!isLoading && <InventoryTabs inventory={inventory} />}
    </div>
  );
};
export default InventoryLanding;
