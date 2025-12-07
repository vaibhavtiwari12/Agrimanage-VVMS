import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Divider } from 'antd';
import {
  DollarCircleOutlined,
  BankOutlined,
  TransactionOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { dateConverter } from '../../Utility/utility';

const { Title, Text } = Typography;

const PurchaserSummary = ({ transactionSummary, date }) => {
  const [outGoingCash, setOutGoingCash] = useState(0);
  const [advanceSettled, setTotalAdvanceSettled] = useState(0);
  const [carryForwardAmount, setCarryForwardAmount] = useState(0);
  const [buyingAmount, setBuyingAmount] = useState(0);
  const [totalOutstandingInThePeriod, setTotalOutstandingInThePeriod] = useState(0);
  useEffect(() => {
    console.log('props changed');
    calculateOutGoingCash();
  }, [transactionSummary]);

  //TODO : Remove all parse int once you change the credit form to use number instead of strings
  const calculateOutGoingCash = () => {
    let totalOutstandingInThePeriod = 0;
    let totalAdvanceSettled = 0;
    let buyingAmount = 0;
    if (transactionSummary && transactionSummary.length > 0) {
      transactionSummary.map(transaction => {
        if (transaction.type === 'CREDIT') {
          totalAdvanceSettled += parseInt(transaction.transactionAmount);
        }
        if (transaction.type === 'DEBIT') {
          buyingAmount += Math.abs(parseInt(transaction.transactionAmount));
          totalOutstandingInThePeriod += parseInt(transaction.transactionAmount);
        }
      });
      setTotalAdvanceSettled(totalAdvanceSettled);
      setTotalOutstandingInThePeriod(totalOutstandingInThePeriod);
      setBuyingAmount(buyingAmount);
      return null;
    }
  };
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Summary Header */}
      <Card style={{ marginBottom: '16px' }}>
        <Space align="center">
          <CalendarOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <FormattedMessage id="summary" defaultMessage="Summary" />
            </Title>
            <Text type="secondary">
              <FormattedMessage id="period" defaultMessage="Period" />: <Text strong>{date}</Text>
            </Text>
          </div>
        </Space>
      </Card>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="totalOutstanding"
                    defaultMessage="Total Outstanding In Period"
                  />
                </div>
                <div style={{ color: '#cf1322', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                  ₹{totalOutstandingInThePeriod.toLocaleString()}
                </div>
              </div>
              <BankOutlined
                style={{
                  fontSize: 24,
                  color: '#cf1322',
                  background: '#cf132222',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage id="totalBuyingAmount" defaultMessage="Total Buying Amount" />
                </div>
                <div style={{ color: '#3f8600', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                  ₹{buyingAmount.toLocaleString()}
                </div>
              </div>
              <DollarCircleOutlined
                style={{
                  fontSize: 24,
                  color: '#3f8600',
                  background: '#3f860022',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="totalAdvanceSettled"
                    defaultMessage="Total Outstanding settled in the period"
                  />
                </div>
                <div style={{ color: '#1890ff', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                  ₹{advanceSettled.toLocaleString()}
                </div>
              </div>
              <TransactionOutlined
                style={{
                  fontSize: 24,
                  color: '#1890ff',
                  background: '#1890ff22',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaserSummary;
