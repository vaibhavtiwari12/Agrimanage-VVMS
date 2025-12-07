import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Descriptions, Space, Button, Badge } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  BankOutlined,
  FileTextOutlined,
  TableOutlined,
  AppstoreOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { EllipsisText } from '../Common';
import { dateConverter } from '../../Utility/utility';

const { Title, Text } = Typography;

const Transactiontable = ({ transactionSummary, isPrint, printHandler, exportHandler }) => {
  const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'card' : 'table');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileOrTablet(isMobile);
      if (!isMobile) {
        setViewMode('table'); // Always use table view on desktop
      } else if (viewMode === 'table') {
        setViewMode('card'); // Switch to card view when moving to mobile
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const columns = useMemo(() => {
    // Print-optimized columns with simplified layout
    if (isPrint) {
      return [
        {
          title: 'Name & Date',
          dataIndex: 'name',
          key: 'name',
          width: '25%',
          render: (text, record) => (
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '10pt', marginBottom: 2 }}>{text}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>
                {dateConverter(record.date).split(' ')[0]}
              </div>
            </div>
          ),
        },
        {
          title: 'Particulars',
          dataIndex: 'particulars',
          key: 'particulars',
          width: '40%',
          render: (particulars, record) => {
            if (!particulars) return '-';
            const commission = particulars.commission ? `${particulars.commission}%` : '0%';
            const commissionAmount = particulars.commissionAmount || 0;
            return (
              <div style={{ fontSize: '9pt', lineHeight: '1.2' }}>
                <div>
                  <strong>Bags:</strong> {particulars.bags || 0}
                </div>
                <div>
                  <strong>Weight:</strong> {particulars.weight || 0} kg
                </div>
                <div>
                  <strong>Rate:</strong> ₹{particulars.rate || 0}/kg
                </div>
                <div>
                  <strong>Commission:</strong> {commission} (₹{commissionAmount})
                </div>
              </div>
            );
          },
        },
        {
          title: 'Financial Summary',
          dataIndex: 'summary',
          key: 'summary',
          width: '35%',
          render: (_, record) => (
            <div style={{ fontSize: '9pt', lineHeight: '1.2' }}>
              {record.advanceTaken && (
                <div>
                  <strong>Advance Taken:</strong> ₹{record.advanceTaken}
                </div>
              )}
              {record.billTotal && (
                <div>
                  <strong>Bill Total:</strong> ₹{record.billTotal}
                </div>
              )}
              {record.advancePaid && (
                <div>
                  <strong>Advance Paid:</strong> ₹{record.advancePaid}
                </div>
              )}
              {record.cashPaid && (
                <div>
                  <strong>Cash Paid:</strong> ₹{record.cashPaid}
                </div>
              )}
              {record.carryForward && (
                <div>
                  <strong>Carry Forward:</strong> ₹{record.carryForward}
                </div>
              )}
            </div>
          ),
        },
      ];
    }

    // Regular detailed columns for screen view
    return [
      {
        title: <FormattedMessage id="name" defaultMessage="Name" />,
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: text => (
          <EllipsisText style={{ fontWeight: 600, color: '#1890ff' }} maxWidth="140px">
            {text}
          </EllipsisText>
        ),
      },
      {
        title: <FormattedMessage id="date" defaultMessage="Date" />,
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: date => <Tag color="blue">{dateConverter(date)}</Tag>,
      },
      {
        title: <FormattedMessage id="advanceTaken" defaultMessage="Advance Taken" />,
        dataIndex: 'advanceTaken',
        key: 'advanceTaken',
        width: 120,
        align: 'right',
        render: value =>
          value ? <Text style={{ color: '#f5222d', fontWeight: 600 }}>₹{value}</Text> : '-',
      },
      {
        title: <FormattedMessage id="particulars" defaultMessage="Particulars" />,
        dataIndex: 'particulars',
        key: 'particulars',
        width: 300,
        render: particulars =>
          particulars ? (
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="Bags">{particulars.bags}</Descriptions.Item>
              <Descriptions.Item label="Weight">{particulars.weight}</Descriptions.Item>
              <Descriptions.Item label="Rate">{particulars.rate}</Descriptions.Item>
              <Descriptions.Item label="Hammali">{particulars.hammali}</Descriptions.Item>
              <Descriptions.Item label="Bhada">{particulars.bhada}</Descriptions.Item>
              <Descriptions.Item label={`Commission(${particulars.commission}%)`}>
                ₹{particulars.commissionAmount}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            '-'
          ),
      },
      {
        title: <FormattedMessage id="billTotal" defaultMessage="Bill Total" />,
        dataIndex: 'billTotal',
        key: 'billTotal',
        width: 120,
        align: 'right',
        render: value =>
          value ? <Text style={{ color: '#52c41a', fontWeight: 600 }}>₹{value}</Text> : '-',
      },
      {
        title: <FormattedMessage id="advancePaid" defaultMessage="Advance Paid" />,
        dataIndex: 'advancePaid',
        key: 'advancePaid',
        width: 120,
        align: 'right',
        render: value =>
          value ? <Text style={{ color: '#722ed1', fontWeight: 600 }}>₹{value}</Text> : '-',
      },
      {
        title: <FormattedMessage id="cashPaid" defaultMessage="Cash Paid" />,
        dataIndex: 'cashPaid',
        key: 'cashPaid',
        width: 120,
        align: 'right',
        render: value =>
          value ? <Text style={{ color: '#13c2c2', fontWeight: 600 }}>₹{value}</Text> : '-',
      },
      {
        title: <FormattedMessage id="carryForward" defaultMessage="Carry Forward" />,
        dataIndex: 'carryForward',
        key: 'carryForward',
        width: 120,
        align: 'right',
        render: value =>
          value ? <Text style={{ color: '#fa8c16', fontWeight: 600 }}>₹{value}</Text> : '-',
      },
    ];
  }, [isPrint]);

  // Render card view for mobile
  const renderCardView = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        padding: isMobileOrTablet ? '0' : '0 12px',
      }}
    >
      {dataSource.map((transaction, index) => (
        <Card
          key={transaction.key}
          size="small"
          hoverable
          style={{
            width: '100%',
            borderRadius: 12,
            border: '1px solid #d9d9d9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          bodyStyle={{ padding: 16, width: '100%' }}
        >
          <Card.Meta
            title={
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <EllipsisText
                  style={{ color: '#1677ff', fontSize: 16, flex: 1, marginRight: 8 }}
                  maxWidth="150px"
                >
                  {transaction.name}
                </EllipsisText>
                <Tag color="blue">{dateConverter(transaction.date)}</Tag>
              </div>
            }
            description={
              <div style={{ marginTop: 8 }}>
                {/* Advance Taken */}
                {transaction.advanceTaken && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <span style={{ color: '#666', fontSize: 13 }}>
                      <FormattedMessage id="advanceTaken" defaultMessage="Advance Taken" />:
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f5222d' }}>
                      ₹{transaction.advanceTaken}
                    </span>
                  </div>
                )}

                {/* Bill Total */}
                {transaction.billTotal && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <span style={{ color: '#666', fontSize: 13 }}>
                      <FormattedMessage id="billTotal" defaultMessage="Bill Total" />:
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#52c41a' }}>
                      ₹{transaction.billTotal}
                    </span>
                  </div>
                )}

                {/* Advance Paid */}
                {transaction.advancePaid && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <span style={{ color: '#666', fontSize: 13 }}>
                      <FormattedMessage id="advancePaid" defaultMessage="Advance Paid" />:
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#722ed1' }}>
                      ₹{transaction.advancePaid}
                    </span>
                  </div>
                )}

                {/* Cash Paid */}
                {transaction.cashPaid && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <span style={{ color: '#666', fontSize: 13 }}>
                      <FormattedMessage id="cashPaid" defaultMessage="Cash Paid" />:
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#13c2c2' }}>
                      ₹{transaction.cashPaid}
                    </span>
                  </div>
                )}

                {/* Carry Forward */}
                {transaction.carryForward && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <span style={{ color: '#666', fontSize: 13 }}>
                      <FormattedMessage id="carryForward" defaultMessage="Carry Forward" />:
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fa8c16' }}>
                      ₹{transaction.carryForward}
                    </span>
                  </div>
                )}

                {/* Particulars */}
                {transaction.particulars && (
                  <div style={{ marginTop: 12 }}>
                    <span
                      style={{ color: '#666', fontSize: 13, marginBottom: 8, display: 'block' }}
                    >
                      <FormattedMessage id="particulars" defaultMessage="Particulars" />:
                    </span>
                    <Descriptions size="small" column={1} bordered>
                      <Descriptions.Item label="Bags">
                        {transaction.particulars.bags}
                      </Descriptions.Item>
                      <Descriptions.Item label="Weight">
                        {transaction.particulars.weight}
                      </Descriptions.Item>
                      <Descriptions.Item label="Rate">
                        {transaction.particulars.rate}
                      </Descriptions.Item>
                      <Descriptions.Item label="Hammali">
                        {transaction.particulars.hammali}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bhada">
                        {transaction.particulars.bhada}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={`Commission(${transaction.particulars.commission}%)`}
                      >
                        ₹{transaction.particulars.commissionAmount}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                )}
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  const dataSource = useMemo(() => {
    if (!transactionSummary || transactionSummary.length === 0) return [];

    return transactionSummary
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((transaction, index) => ({
        key: index,
        name: transaction.name,
        date: transaction.date,
        advanceTaken: transaction.type === 'DEBIT' ? transaction.transactionAmount : null,
        particulars:
          transaction.type === 'CREDIT'
            ? {
                bags: transaction.numberofBags,
                weight: transaction.totalweight,
                rate: transaction.rate,
                hammali: transaction.hammali,
                bhada: transaction.bhada,
                commission: transaction.commission,
                commissionAmount: (transaction.grossTotal * (transaction.commission / 100)).toFixed(
                  2
                ),
              }
            : null,
        billTotal: transaction.netTotal,
        advancePaid:
          transaction.type === 'CREDIT'
            ? transaction.advanceSettlement
            : transaction.type === 'ADVANCESETTLEMENT'
              ? transaction.transactionAmount
              : null,
        cashPaid: transaction.paidToKisan,
        carryForward: transaction.carryForwardFromThisEntry,
      }));
  }, [transactionSummary]);

  return (
    <Card
      style={{
        marginTop: 16,
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />
          <Title level={4} style={{ margin: 0, color: '#000', fontWeight: 700 }}>
            <FormattedMessage
              id="transactionsInPeriod"
              defaultMessage="Transactions in the Period"
            />
          </Title>
        </div>
      }
      extra={
        !isMobileOrTablet && !isPrint && printHandler ? (
          <Button
            type="link"
            icon={<PrinterOutlined />}
            onClick={printHandler}
            size="large"
            style={{
              fontWeight: 600,
              color: '#1890ff',
            }}
          >
            <FormattedMessage id="common.print" defaultMessage="Print Report" />
          </Button>
        ) : null
      }
      bodyStyle={{ padding: isPrint ? 8 : 24 }}
    >
      {/* View Toggle Buttons - Only show on mobile/tablet and when not printing */}
      {isMobileOrTablet && !isPrint && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button.Group size="small" style={{ marginBottom: printHandler ? 12 : 0 }}>
            <Button
              type={viewMode === 'table' ? 'primary' : 'default'}
              icon={<TableOutlined />}
              onClick={() => setViewMode('table')}
            >
              <FormattedMessage id="table" defaultMessage="Table" />
            </Button>
            <Button
              type={viewMode === 'card' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('card')}
            >
              <FormattedMessage id="cards" defaultMessage="Cards" />
            </Button>
          </Button.Group>

          {/* Action Buttons for Mobile */}
          {printHandler && (
            <Button
              type="link"
              icon={<PrinterOutlined />}
              onClick={printHandler}
              size="large"
              block
              style={{
                fontWeight: 600,
                color: '#1890ff',
              }}
            >
              <FormattedMessage id="common.print" defaultMessage="Print Report" />
            </Button>
          )}
        </div>
      )}

      {/* Render based on view mode and screen size */}
      {isMobileOrTablet && viewMode === 'card' && !isPrint ? (
        renderCardView()
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={isPrint ? {} : { x: isMobileOrTablet ? 800 : 1200 }}
          size={isPrint ? 'small' : 'middle'}
          bordered
          style={{
            borderRadius: isPrint ? 0 : 8,
            overflow: 'auto',
            fontSize: isPrint ? '10pt' : 'inherit',
          }}
          rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        />
      )}

      <style jsx global>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f2f5;
          font-weight: 600;
          color: #1890ff;
        }

        @media print {
          .ant-table {
            page-break-inside: avoid;
            border-collapse: collapse !important;
          }
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            padding: 8px !important;
            font-size: 9pt !important;
            line-height: 1.2 !important;
            border: 1px solid #000 !important;
            background: white !important;
            color: black !important;
            vertical-align: top !important;
          }
          .ant-table-thead > tr > th {
            font-weight: bold !important;
            background: #f5f5f5 !important;
            text-align: center !important;
          }
          .ant-table-tbody > tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .ant-descriptions {
            font-size: 8pt !important;
          }
          .ant-descriptions-item-label,
          .ant-descriptions-item-content {
            padding: 2px 4px !important;
            font-size: 8pt !important;
          }
          .ant-tag {
            border: none !important;
            background: transparent !important;
            color: black !important;
            font-size: 9pt !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default Transactiontable;
