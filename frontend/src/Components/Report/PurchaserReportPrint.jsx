import React from 'react';
import { Card, Row, Col, Typography, Divider, Space } from 'antd';
import {
  CalendarOutlined,
  BankOutlined,
  DollarCircleOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

const { Title, Text } = Typography;

const PurchaserReportPrint = React.forwardRef((props, ref) => {
  const { transactionSummary, date } = props;

  // Calculate summary values
  const calculateSummary = () => {
    if (!transactionSummary || transactionSummary.length === 0) {
      return {
        totalOutstandingInPeriod: 0,
        totalBuyingAmount: 0,
        totalOutstandingSettled: 0,
        totalTransactions: 0,
      };
    }

    let totalOutstandingInPeriod = 0;
    let totalBuyingAmount = 0;
    let totalOutstandingSettled = 0;
    let totalTransactions = transactionSummary.length;

    transactionSummary.forEach(transaction => {
      if (transaction.type === 'DEBIT') {
        totalBuyingAmount += Math.abs(parseInt(transaction.transactionAmount || 0));
        totalOutstandingInPeriod += parseInt(transaction.transactionAmount || 0);
      }
      if (transaction.type === 'CREDIT') {
        totalOutstandingSettled += Math.abs(parseInt(transaction.transactionAmount || 0));
      }
    });

    return {
      totalOutstandingInPeriod,
      totalBuyingAmount,
      totalOutstandingSettled,
      totalTransactions,
    };
  };

  const summary = calculateSummary();

  // Sort transactions by date (newest first)
  const sortedTransactions = transactionSummary
    ? [...transactionSummary].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div ref={ref} style={{ padding: '20px', backgroundColor: 'white' }}>
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #000',
          paddingBottom: '15px',
        }}
      >
        <Title level={2} style={{ margin: 0, color: '#000' }}>
          PURCHASER TRANSACTION REPORT
        </Title>
        <Text style={{ fontSize: '14px', color: '#666' }}>
          Generated on {new Date().toLocaleDateString()} - Period: {date}
        </Text>
      </div>

      {/* Summary Section */}
      <div style={{ marginBottom: '30px' }}>
        <Title level={4} style={{ marginBottom: '15px', color: '#000' }}>
          <CalendarOutlined style={{ marginRight: '8px', color: '#1677ff' }} />
          Transaction Summary
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Text style={{ fontSize: '12px', color: '#666' }}>
                    Total Outstanding In Period
                  </Text>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#cf1322' }}>
                    ₹{summary.totalOutstandingInPeriod.toLocaleString()}
                  </div>
                </div>
                <BankOutlined style={{ fontSize: '20px', color: '#cf1322' }} />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Text style={{ fontSize: '12px', color: '#666' }}>Total Buying Amount</Text>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3f8600' }}>
                    ₹{summary.totalBuyingAmount.toLocaleString()}
                  </div>
                </div>
                <DollarCircleOutlined style={{ fontSize: '20px', color: '#3f8600' }} />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Text style={{ fontSize: '12px', color: '#666' }}>
                    Total Outstanding Settled in the Period
                  </Text>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                    ₹{summary.totalOutstandingSettled.toLocaleString()}
                  </div>
                </div>
                <TransactionOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Transactions Table */}
      <div>
        <Title level={4} style={{ marginBottom: '15px', color: '#000' }}>
          <TransactionOutlined style={{ marginRight: '8px', color: '#1677ff' }} />
          Transaction Details ({summary.totalTransactions} transactions)
        </Title>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd',
            fontSize: '11px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  width: '20%',
                }}
              >
                Name & Date
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  width: '15%',
                }}
              >
                Bought From
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  width: '35%',
                }}
              >
                Particulars
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  width: '15%',
                }}
              >
                Outstanding Settled
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  width: '15%',
                }}
              >
                Purchase Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction, index) => {
              const transactionDate = new Date(transaction.date).toLocaleDateString();
              const purchaserName = transaction.name || 'N/A';
              const companyName = transaction.companyName || 'N/A';
              const boughtFrom = transaction.kisanName || transaction.sellerName || '-';

              let particularsContent = '';
              let outstandingSettled = '-';
              let purchaseAmount = '-';

              if (transaction.type === 'CREDIT') {
                particularsContent = 'Advance Payment';
                outstandingSettled = `₹${Math.abs(parseInt(transaction.transactionAmount || 0)).toLocaleString()}`;
              } else if (transaction.type === 'DEBIT') {
                // Build particulars with bag, weight, rate, commission
                const bags = parseInt(transaction.numberofBags || 0);
                const weight = parseFloat(transaction.totalweight || 0);
                const rate = parseFloat(transaction.rate || 0);
                const commission = parseFloat(transaction.commission || 0);

                particularsContent = `${bags} bags, ${weight.toFixed(2)} kg @ ₹${rate}/kg${commission ? ` (${commission}% comm.)` : ''}`;

                // Purchase amount is the transaction amount for DEBIT
                purchaseAmount = `₹${Math.abs(parseInt(transaction.transactionAmount || 0)).toLocaleString()}`;

                // Outstanding settled would be any advance settlement
                if (transaction.advanceSettlement && parseInt(transaction.advanceSettlement) > 0) {
                  outstandingSettled = `₹${parseInt(transaction.advanceSettlement).toLocaleString()}`;
                }
              }

              return (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{purchaserName}</div>
                    {companyName !== 'N/A' && (
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>
                        {companyName}
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: '#666' }}>{transactionDate}</div>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', verticalAlign: 'top' }}>
                    {boughtFrom}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', verticalAlign: 'top' }}>
                    {particularsContent}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px',
                      verticalAlign: 'top',
                      textAlign: 'right',
                    }}
                  >
                    {outstandingSettled}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px',
                      verticalAlign: 'top',
                      textAlign: 'right',
                    }}
                  >
                    {purchaseAmount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedTransactions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              border: '1px solid #ddd',
              backgroundColor: '#f9f9f9',
            }}
          >
            No transactions found for the selected period.
          </div>
        )}
      </div>
    </div>
  );
});

export default PurchaserReportPrint;
