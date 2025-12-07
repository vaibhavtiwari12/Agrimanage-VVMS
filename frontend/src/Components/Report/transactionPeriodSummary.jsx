import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Divider } from 'antd';
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
  CarryOutOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { dateConverter, toFixed } from '../../Utility/utility';

const { Title, Text } = Typography;

const Transactionperiodsummary = ({ transactionSummary, date, isPrint }) => {
  const [outGoingCash, setOutGoingCash] = useState(0);
  const [advanceSettled, setTotalAdvanceSettled] = useState(0);
  const [carryForwardAmount, setCarryForwardAmount] = useState(0);
  const [advanceTaken, setAdvanceTaken] = useState(0);
  const [cashPaidTokisan, setCashPaidTokisan] = useState(0);
  const [totalComissionEarned, setTotalComissionEarned] = useState(0);

  useEffect(() => {
    calculateOutGoingCash();
  }, [transactionSummary]);

  //TODO : Remove all parse int once you change the credit form to use number instead of strings
  const calculateOutGoingCash = () => {
    let totalOutGoingCash = 0;
    let totalAdvanceSettled = 0;
    let totalCarryForwardAmount = 0;
    let cashPaidTokisan = 0;
    let advanceTaken = 0;
    let comissionEarned = 0;

    if (transactionSummary && transactionSummary.length > 0) {
      transactionSummary.map(transaction => {
        if (transaction.type === 'DEBIT') {
          totalOutGoingCash += Math.abs(parseInt(transaction.transactionAmount));
          advanceTaken += Math.abs(parseInt(transaction.transactionAmount));
        }
        if (transaction.type === 'CREDIT') {
          totalOutGoingCash += parseInt(transaction.paidToKisan);
          cashPaidTokisan += parseInt(transaction.paidToKisan);
          totalCarryForwardAmount += parseInt(transaction.carryForwardAmount);
          totalAdvanceSettled += parseInt(transaction.advanceSettlement);
          comissionEarned += transaction.grossTotal * (transaction.commission / 100);
        }
      });

      setOutGoingCash(totalOutGoingCash);
      setTotalAdvanceSettled(totalAdvanceSettled);
      setCarryForwardAmount(totalCarryForwardAmount);
      setCashPaidTokisan(cashPaidTokisan);
      setAdvanceTaken(advanceTaken);
      setTotalComissionEarned(comissionEarned);

      return null;
    }
  };
  return (
    <div style={{ marginBottom: isPrint ? 16 : 16 }}>
      {/* Summary Cards - Regular display mode */}
      <Row gutter={[16, 16]}>
        {/* Report Date Info - Compact inline style */}
        <Col span={24}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              padding: '8px 16px',
              background: '#f8f9fa',
              borderRadius: 8,
              border: '1px solid #e9ecef',
            }}
          >
            <CalendarOutlined
              style={{
                fontSize: 14,
                color: '#1890ff',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: '#666',
                fontWeight: 500,
              }}
            >
              <FormattedMessage id="report.reportPeriod" defaultMessage="Report Period" />:
              <span style={{ color: '#1890ff', marginLeft: 4 }}>{date}</span>
            </Text>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="report.totalOutgoingCash"
                    defaultMessage="Total Outgoing Cash"
                  />
                </div>
                <div style={{ color: '#1890ff', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                  ₹{outGoingCash.toLocaleString()}
                </div>
              </div>
              <DollarOutlined
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

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="report.totalAdvanceTaken"
                    defaultMessage="Total Advance Taken"
                  />
                </div>
                <div style={{ color: '#f5222d', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                  ₹{advanceTaken.toLocaleString()}
                </div>
              </div>
              <ArrowDownOutlined
                style={{
                  fontSize: 24,
                  color: '#f5222d',
                  background: '#f5222d22',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage id="report.totalCashPaid" defaultMessage="Total Cash Paid" />
                </div>
                <div style={{ color: '#52c41a', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                  ₹{cashPaidTokisan.toLocaleString()}
                </div>
              </div>
              <BankOutlined
                style={{
                  fontSize: 24,
                  color: '#52c41a',
                  background: '#52c41a22',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="report.totalAdvanceSettled"
                    defaultMessage="Total Advance Settled"
                  />
                </div>
                <div style={{ color: '#722ed1', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                  ₹{advanceSettled.toLocaleString()}
                </div>
              </div>
              <ArrowUpOutlined
                style={{
                  fontSize: 24,
                  color: '#722ed1',
                  background: '#722ed122',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="report.totalCarryForward"
                    defaultMessage="Total Carry Forward"
                  />
                </div>
                <div style={{ color: '#fa8c16', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                  ₹{carryForwardAmount.toLocaleString()}
                </div>
              </div>
              <CarryOutOutlined
                style={{
                  fontSize: 24,
                  color: '#fa8c16',
                  background: '#fa8c1622',
                  borderRadius: '50%',
                  padding: 8,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  <FormattedMessage
                    id="report.totalCommissionEarned"
                    defaultMessage="Total Commission Earned"
                  />
                </div>
                <div style={{ color: '#13c2c2', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                  ₹{toFixed(totalComissionEarned)}
                </div>
              </div>
              <PercentageOutlined
                style={{
                  fontSize: 24,
                  color: '#13c2c2',
                  background: '#13c2c222',
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

export default Transactionperiodsummary;
