import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Alert } from 'antd';
import {
  InfoCircleOutlined,
  AppstoreOutlined,
  AppleOutlined,
  DatabaseOutlined,
  GoldOutlined,
  ShopOutlined,
  CoffeeOutlined,
  BugOutlined,
  EnvironmentOutlined,
  StarOutlined,
  HeartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import InventoryTable from './InventoryTable';
import Inventorysummary from './InventorySummary';

const { Title, Text } = Typography;

const InventoryTabs = ({ inventory }) => {
  const [activeKey, setActiveKey] = useState('0');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);

  // Array of bag/container icons for vegetable storage
  const tabIcons = [
    AppstoreOutlined, // Grid/package container
    GoldOutlined, // Golden package/bag
  ];

  // Function to get an icon for each tab index
  const getTabIcon = index => {
    const IconComponent = tabIcons[index % tabIcons.length];
    return <IconComponent style={{ marginRight: 10 }} />;
  };

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate tab items for Ant Design Tabs (reverse order)
  const reversedInventory = [...inventory].reverse();
  const tabItems = reversedInventory.map((inv, index) => ({
    key: index.toString(),
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {getTabIcon(index)}
        <span style={{ fontWeight: 600 }}>{inv.itemName}</span>
      </div>
    ),
    children: (
      <div style={{ marginTop: 16 }}>
        {/* Summary component with its own card styling */}
        <Inventorysummary inventory={inv} />

        {/* Table below summary */}
        <InventoryTable inventoryId={inv._id} />
      </div>
    ),
  }));

  return (
    <div>
      {inventory.length > 0 ? (
        <div>
          {/* Tabs outside the card */}
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={tabItems}
            size="large"
            style={{
              margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
            }}
            tabBarStyle={{
              marginBottom: 16,
              paddingLeft: 0,
              paddingRight: 0,
            }}
          />
        </div>
      ) : (
        <Card
          style={{
            margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ padding: '48px 24px' }}>
            <InfoCircleOutlined style={{ fontSize: 48, color: '#8c8c8c', marginBottom: 16 }} />
            <Title level={4} type="secondary">
              <FormattedMessage id="noInventoryItems" defaultMessage="No Inventory Items Found" />
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              <FormattedMessage
                id="addInventoryPrompt"
                defaultMessage="Please add inventory items to do credit entry or to see the inventory."
              />
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};
export default InventoryTabs;
