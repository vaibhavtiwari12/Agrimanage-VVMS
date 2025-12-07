import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Card, Typography, Tag, Descriptions, Space, Button, Badge } from 'antd';
import { messageCompat as message } from '../../Utility/notificationHelper';
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  BankOutlined,
  FileTextOutlined,
  TableOutlined,
  AppstoreOutlined,
  PrinterOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { EllipsisText } from '../Common';
import { dateConverter } from '../../Utility/utility';

const { Title, Text } = Typography;

/**
 * PurchaserReportTxnTable Component
 *
 * Displays transaction data in both table and card views with clickable purchaser and kisan names.
 *
 * Features:
 * - Clickable purchaser names navigate to /purchaserDetails/:id
 * - Clickable kisan names navigate to /kisanDetails/:id
 * - Visual indicators (link icons and hover effects) for clickable elements
 * - Responsive design with table and card views
 * - Print-friendly layout (removes clickable behavior when printing)
 *
 * @param {Array} transactionSummary - Array of transaction objects
 * @param {boolean} isPrint - Whether the component is in print mode
 * @param {Function} printHandler - Handler for printing the report
 * @param {Function} exportHandler - Handler for exporting the report
 * @param {Function} onPurchaserClick - Callback when purchaser name is clicked (name, id)
 * @param {Function} onKisanClick - Callback when kisan name is clicked (name, id)
 */
const PurchaserReportTxnTable = ({
  transactionSummary,
  isPrint,
  printHandler,
  exportHandler,
  onPurchaserClick,
  onKisanClick,
}) => {
  const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'card' : 'table');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);
  const history = useHistory();

  // Click handlers for purchaser and kisan names
  const handlePurchaserClick = (purchaserName, purchaserId) => {
    if (onPurchaserClick) {
      onPurchaserClick(purchaserName, purchaserId);
    } else {
      console.log('Purchaser clicked:', { name: purchaserName, id: purchaserId });

      if (purchaserId) {
        // Navigate to purchaser details page
        history.push(`/purchaserDetails/${purchaserId}`);
        message.info(`Navigating to ${purchaserName}'s details`);
      } else {
        // Fallback if no ID available
        message.warning('Purchaser ID not available for navigation');
      }
    }
  };

  const handleKisanClick = (kisanName, kisanId) => {
    if (onKisanClick) {
      onKisanClick(kisanName, kisanId);
    } else {
      console.log('Kisan clicked:', { name: kisanName, id: kisanId });

      if (kisanId) {
        // Navigate to kisan details page
        history.push(`/kisanDetails/${kisanId}`);
        message.info(`Navigating to ${kisanName}'s details`);
      } else {
        // Fallback if no ID available
        message.warning('Kisan ID not available for navigation');
      }
    }
  };

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
              <div style={{ fontWeight: 'bold', fontSize: '10pt', marginBottom: 2 }}>
                {text} - {record.companyName}
              </div>
              <div style={{ fontSize: '9pt', color: '#666' }}>
                {dateConverter(record.date).split(' ')[0]}
              </div>
            </div>
          ),
        },
        {
          title: 'Purchase Details',
          dataIndex: 'particulars',
          key: 'particulars',
          width: '40%',
          render: (particulars, record) => {
            if (record.type !== 'DEBIT') return '-';
            return (
              <div style={{ fontSize: '9pt', lineHeight: '1.2' }}>
                <div>
                  <strong>Bags:</strong> {record.numberofBags || 0}
                </div>
                <div>
                  <strong>Weight:</strong> {record.totalweight || 0} kg
                </div>
                <div>
                  <strong>Rate:</strong> ₹{record.rate || 0}/kg
                </div>
                <div>
                  <strong>Bought From:</strong> {record.kisanName || '-'}
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
              {record.type === 'DEBIT' && (
                <div>
                  <strong>Purchase Amount:</strong> ₹{record.transactionAmount || 0}
                </div>
              )}
              {record.type === 'CREDIT' && (
                <div>
                  <strong>Outstanding Settled:</strong> ₹{record.transactionAmount || 0}
                </div>
              )}
            </div>
          ),
        },
      ];
    }

    // Regular columns for screen display
    return [
      {
        title: (
          <FormattedMessage id="purchaserReport.nameCompany" defaultMessage="Name - Company" />
        ),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: (text, record) => (
          <div>
            <div
              style={{
                fontWeight: 600,
                color: '#1677ff',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              className={!isPrint ? 'clickable-field' : ''}
              onClick={!isPrint ? () => handlePurchaserClick(text, record.purchaserId) : undefined}
              title={!isPrint ? 'Click to view purchaser details' : undefined}
            >
              {!isPrint && <LinkOutlined style={{ fontSize: 12 }} />}
              {text}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.companyName}</div>
          </div>
        ),
      },
      {
        title: <FormattedMessage id="date" defaultMessage="Date" />,
        dataIndex: 'date',
        key: 'date',
        width: '12%',
        render: date => (
          <Tag color="blue" style={{ margin: 0 }}>
            {dateConverter(date)}
          </Tag>
        ),
      },
      {
        title: (
          <FormattedMessage id="purchaserReport.buyingAmount" defaultMessage="Purchase Amount" />
        ),
        dataIndex: 'buyingAmount',
        key: 'buyingAmount',
        width: '15%',
        align: 'right',
        render: (_, record) =>
          record.type === 'DEBIT' ? (
            <Text style={{ color: '#fa8c16', fontWeight: 600 }}>₹{record.transactionAmount}</Text>
          ) : (
            '-'
          ),
      },
      {
        title: <FormattedMessage id="purchaserReport.boughtFrom" defaultMessage="Bought From" />,
        dataIndex: 'boughtFrom',
        key: 'boughtFrom',
        width: '15%',
        render: (_, record) =>
          record.type === 'DEBIT' ? (
            <EllipsisText
              style={{
                color: '#1677ff',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              className={!isPrint ? 'clickable-field' : ''}
              onClick={
                !isPrint ? () => handleKisanClick(record.kisanName, record.kisan) : undefined
              }
              maxWidth="150px"
              tooltipTitle={
                !isPrint ? `Click to view kisan details: ${record.kisanName}` : record.kisanName
              }
            >
              {!isPrint && <LinkOutlined style={{ fontSize: 12 }} />}
              {record.kisanName}
            </EllipsisText>
          ) : (
            '-'
          ),
      },
      {
        title: <FormattedMessage id="particulars" defaultMessage="Particulars" />,
        dataIndex: 'particulars',
        key: 'particulars',
        width: '25%',
        render: (_, record) => {
          if (record.type !== 'DEBIT') return '-';
          return (
            <Descriptions size="small" column={1} style={{ margin: 0 }}>
              <Descriptions.Item
                label={<FormattedMessage id="bags" defaultMessage="Bags" />}
                style={{ paddingBottom: 2 }}
              >
                <Text strong>{record.numberofBags}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage id="weight" defaultMessage="Weight" />}
                style={{ paddingBottom: 2 }}
              >
                <Text strong>{record.totalweight} kg</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage id="rate" defaultMessage="Rate" />}
                style={{ paddingBottom: 0 }}
              >
                <Text strong>₹{record.rate}/kg</Text>
              </Descriptions.Item>
            </Descriptions>
          );
        },
      },
      {
        title: (
          <FormattedMessage
            id="purchaserReport.outstandingSettled"
            defaultMessage="Outstanding Settled"
          />
        ),
        dataIndex: 'outstandingSettled',
        key: 'outstandingSettled',
        width: '13%',
        align: 'right',
        render: (_, record) =>
          record.type === 'CREDIT' ? (
            <Text style={{ color: '#52c41a', fontWeight: 600 }}>₹{record.transactionAmount}</Text>
          ) : (
            '-'
          ),
      },
    ];
  }, [isPrint]);

  // Transform data for display
  const dataSource = useMemo(() => {
    if (!transactionSummary || !Array.isArray(transactionSummary)) return [];

    return transactionSummary
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((transaction, index) => ({
        key: index,
        ...transaction,
      }));
  }, [transactionSummary]);

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
                <span
                  style={{
                    color: '#1677ff',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  className="clickable-field"
                  onClick={() => handlePurchaserClick(transaction.name, transaction.purchaserId)}
                  title="Click to view purchaser details"
                >
                  <LinkOutlined style={{ fontSize: 12 }} />
                  {transaction.name}
                </span>
                <Tag color="blue">{dateConverter(transaction.date)}</Tag>
              </div>
            }
            description={
              <div style={{ marginTop: 8 }}>
                {/* Company Name */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    <FormattedMessage id="company" defaultMessage="Company" />:
                  </span>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{transaction.companyName}</span>
                </div>

                {/* Purchase Amount */}
                {transaction.type === 'DEBIT' && (
                  <>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                    >
                      <span style={{ color: '#666', fontSize: 13 }}>
                        <FormattedMessage
                          id="purchaserReport.buyingAmount"
                          defaultMessage="Purchase Amount"
                        />
                        :
                      </span>
                      <span style={{ fontWeight: 600, color: '#fa8c16', fontSize: 13 }}>
                        ₹{transaction.transactionAmount}
                      </span>
                    </div>

                    {/* Bought From */}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                    >
                      <span style={{ color: '#666', fontSize: 13 }}>
                        <FormattedMessage
                          id="purchaserReport.boughtFrom"
                          defaultMessage="Bought From"
                        />
                        :
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          color: '#1677ff',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        className="clickable-field"
                        onClick={() => handleKisanClick(transaction.kisanName, transaction.kisan)}
                        title="Click to view kisan details"
                      >
                        <LinkOutlined style={{ fontSize: 10 }} />
                        {transaction.kisanName}
                      </span>
                    </div>

                    {/* Particulars */}
                    <div
                      style={{
                        marginTop: 8,
                        padding: 8,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 6,
                      }}
                    >
                      <div
                        style={{ fontSize: 12, color: '#666', marginBottom: 4, fontWeight: 500 }}
                      >
                        <FormattedMessage id="particulars" defaultMessage="Particulars" />:
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 4,
                          fontSize: 12,
                        }}
                      >
                        <div>
                          <strong>Bags:</strong> {transaction.numberofBags}
                        </div>
                        <div>
                          <strong>Weight:</strong> {transaction.totalweight} kg
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <strong>Rate:</strong> ₹{transaction.rate}/kg
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Outstanding Settled */}
                {transaction.type === 'CREDIT' && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <span style={{ color: '#666', fontSize: 13 }}>
                      <FormattedMessage
                        id="purchaserReport.outstandingSettled"
                        defaultMessage="Outstanding Settled"
                      />
                      :
                    </span>
                    <span style={{ fontWeight: 600, color: '#52c41a', fontSize: 13 }}>
                      ₹{transaction.transactionAmount}
                    </span>
                  </div>
                )}
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  if (!transactionSummary || transactionSummary.length === 0) {
    return null;
  }

  return (
    <Card
      title={
        !isPrint && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0, color: '#000', fontWeight: 700 }}>
              <FormattedMessage
                id="purchaserReport.transactionsInPeriod"
                defaultMessage="Transactions in the Period"
              />
            </Title>
          </div>
        )
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

        /* Clickable field styles */
        .clickable-field {
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .clickable-field:hover {
          color: #0958d9 !important;
          text-decoration: underline;
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

          /* Remove clickable styles in print */
          .clickable-field {
            cursor: default !important;
            text-decoration: none !important;
            color: black !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default PurchaserReportTxnTable;
