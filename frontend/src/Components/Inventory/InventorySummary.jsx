import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Row, Col, Typography } from 'antd';
import { DatabaseOutlined, ShoppingOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Inventorysummary = ({ inventory }) => {
  if (!inventory) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChartOutlined style={{ fontSize: 18, color: '#1677ff' }} />
            <Title level={5} style={{ margin: 0, color: '#000', fontWeight: 600 }}>
              <FormattedMessage id="inventorySummary" defaultMessage="Inventory Summary" />
            </Title>
          </div>
        }
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>
                    <FormattedMessage id="total" defaultMessage="Total" />{' '}
                    <FormattedMessage id="weight" defaultMessage="Weight" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#52c41a' }}>
                    {inventory.totalWeight || 0} <FormattedMessage id="kg" defaultMessage="kg" />
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#f6ffed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DatabaseOutlined style={{ color: '#52c41a', fontSize: 24 }} />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>
                    <FormattedMessage id="total" defaultMessage="Total" />{' '}
                    <FormattedMessage id="bags" defaultMessage="Bags" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1677ff' }}>
                    {inventory.totalBags || 0} <FormattedMessage id="bags" defaultMessage="bags" />
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#e6f4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingOutlined style={{ color: '#1677ff', fontSize: 24 }} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default Inventorysummary;
