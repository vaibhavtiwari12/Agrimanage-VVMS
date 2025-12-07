import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  Card,
  Typography,
  Tag,
  Button,
  Pagination,
  Row,
  Col,
  Select,
  Spin,
  message,
} from 'antd';
import {
  FileTextOutlined,
  TableOutlined,
  AppstoreOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { EllipsisText, SimpleShimmer } from '../Common';
import { dateConverter } from '../../Utility/utility';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const InventoryTable = ({ inventoryId }) => {
  const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'card' : 'table');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const intl = useIntl();

  // Fetch paginated transactions from backend
  const fetchPaginatedTransactions = useCallback(
    async (page = currentPage, size = pageSize) => {
      if (!inventoryId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`/inventory/transactions/${inventoryId}`, {
          params: {
            page,
            pageSize: size,
          },
        });

        const {
          transactions: fetchedTransactions,
          totalTransactions: total,
          totalPages: pages,
        } = response.data;
        setTransactions(fetchedTransactions || []);
        setTotalTransactions(total || 0);
        setTotalPages(pages || 0);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError(
          intl.formatMessage({
            id: 'inventory.transactionsFetchError',
            defaultMessage: 'Failed to load transactions',
          })
        );
        message.error(
          intl.formatMessage({
            id: 'inventory.transactionsFetchError',
            defaultMessage: 'Failed to load transactions',
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [inventoryId, currentPage, pageSize]
  );

  // Reset pagination when inventoryId changes (switching tabs)
  useEffect(() => {
    setCurrentPage(1);
    setTransactions([]);
    setTotalTransactions(0);
    if (inventoryId) {
      fetchPaginatedTransactions(1, pageSize);
    }
  }, [inventoryId, pageSize]);

  // Fetch data when page changes
  useEffect(() => {
    if (inventoryId && currentPage > 1) {
      fetchPaginatedTransactions(currentPage, pageSize);
    }
  }, [currentPage, fetchPaginatedTransactions, inventoryId]);

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

  // Click handlers for navigation
  const handleKisanClick = useCallback(
    (kisanName, kisanId) => {
      if (kisanId) {
        history.push(`/kisanDetails/${kisanId}`);
        message.info(
          intl.formatMessage(
            {
              id: 'inventory.navigatingToKisan',
              defaultMessage: "Navigating to {kisanName}'s details",
            },
            { kisanName }
          )
        );
      } else {
        message.warning(
          intl.formatMessage({
            id: 'inventory.kisanIdNotAvailable',
            defaultMessage: 'Kisan ID not available for navigation',
          })
        );
      }
    },
    [history, intl]
  );

  const handlePurchaserClick = useCallback(
    (purchaserName, purchaserId) => {
      if (purchaserId) {
        history.push(`/purchaserDetails/${purchaserId}`);
        message.info(
          intl.formatMessage(
            {
              id: 'inventory.navigatingToPurchaser',
              defaultMessage: "Navigating to {purchaserName}'s details",
            },
            { purchaserName }
          )
        );
      } else {
        message.warning(
          intl.formatMessage({
            id: 'inventory.purchaserIdNotAvailable',
            defaultMessage: 'Purchaser ID not available for navigation',
          })
        );
      }
    },
    [history, intl]
  );

  // Print handler for inventory transactions
  const handlePrint = useCallback(async () => {
    if (!inventoryId) {
      message.warning(
        intl.formatMessage({
          id: 'inventory.noInventorySelected',
          defaultMessage: 'No inventory selected',
        })
      );
      return;
    }

    try {
      // Show loading message
      message.loading(
        intl.formatMessage({
          id: 'inventory.preparingPrint',
          defaultMessage: 'Preparing transactions for printing...',
        }),
        2
      );

      // Fetch ALL transactions for printing (not paginated)
      const response = await axios.get(`/inventory/transactions/${inventoryId}`, {
        params: {
          page: 1,
          pageSize: 100000, // Large number to get all transactions
        },
      });

      const { transactions: allTransactions, totalTransactions: total } = response.data;

      if (!allTransactions || allTransactions.length === 0) {
        message.warning(
          intl.formatMessage({
            id: 'inventory.noTransactionsToPrint',
            defaultMessage: 'No transactions to print',
          })
        );
        return;
      }

      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';

      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Inventory Transactions Report - All Transactions</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #000;
              background: white;
              width: 210mm;
              margin: 0 auto;
              padding: 15mm;
            }
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            
            .header h1 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 5px;
              color: #000;
            }
            
            .header p {
              font-size: 12pt;
              color: #666;
            }
            
            .transactions-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            
            .transactions-table th,
            .transactions-table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
              vertical-align: top;
              font-size: 9pt;
            }
            
            .transactions-table th {
              background: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }
            
            .kisan-cell { width: 20%; }
            .purchaser-cell { width: 20%; }
            .date-cell { width: 12%; }
            .weight-cell { width: 12%; }
            .bags-cell { width: 12%; }
            .rate-cell { width: 12%; }
            .index-cell { width: 8%; text-align: center; }
            
            .transaction-name {
              font-weight: bold;
              margin-bottom: 2px;
            }
            
            .transaction-date {
              font-size: 8pt;
              color: #666;
            }
            
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .page-break { 
                page-break-before: always; 
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVENTORY TRANSACTIONS REPORT</h1>
            <p>All Transactions - Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Transactions: ${total}</p>
          </div>
          
          <table class="transactions-table">
            <thead>
              <tr>
                <th class="index-cell">#</th>
                <th class="kisan-cell">Kisan Details</th>
                <th class="purchaser-cell">Purchaser Details</th>
                <th class="date-cell">Date</th>
                <th class="weight-cell">Weight (kg)</th>
                <th class="bags-cell">Bags</th>
                <th class="rate-cell">Rate (₹/kg)</th>
              </tr>
            </thead>
            <tbody>
              ${allTransactions
                .map((transaction, index) => {
                  return `
                  <tr>
                    <td class="index-cell">${index + 1}</td>
                    <td class="kisan-cell">
                      <div class="transaction-name">${transaction.kisanName || '-'}</div>
                    </td>
                    <td class="purchaser-cell">
                      <div class="transaction-name">${transaction.purchaserName || '-'}</div>
                    </td>
                    <td class="date-cell">
                      <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
                    </td>
                    <td class="weight-cell">${transaction.totalweight || 0} kg</td>
                    <td class="bags-cell">${transaction.numberofBags || 0}</td>
                    <td class="rate-cell">₹${transaction.rate || 0}/kg</td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
          
          ${
            allTransactions.length === 0
              ? `
            <div style="text-align: center; padding: 40px; color: #666; border: 1px solid #ddd; background: #f9f9f9;">
              No transactions found.
            </div>
          `
              : ''
          }
        </body>
        </html>
      `;

      // Write content to iframe
      iframeDoc.open();
      iframeDoc.write(printHTML);
      iframeDoc.close();

      // Wait for content to load then print
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();

          // Clean up the iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
            message.success(
              intl.formatMessage(
                {
                  id: 'inventory.printSuccess',
                  defaultMessage: 'All {total} transactions printed successfully',
                },
                { total }
              )
            );
          }, 1000);
        }, 500);
      };
    } catch (error) {
      console.error('Print error:', error);
      message.error(
        intl.formatMessage({
          id: 'inventory.printError',
          defaultMessage: 'Failed to print inventory transactions',
        })
      );
    }
  }, [inventoryId]);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: '60px',
        render: (_, __, index) => (
          <Text strong style={{ color: '#666' }}>
            {index + 1}
          </Text>
        ),
      },
      {
        title: <FormattedMessage id="kisanDetailsTitle" defaultMessage="Kisan Details" />,
        dataIndex: 'kisanName',
        key: 'kisanName',
        width: '20%',
        render: (text, record) => (
          <EllipsisText
            style={{
              color: '#1677ff',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
            className="clickable-field"
            onClick={() => handleKisanClick(text, record.kisanID)}
            maxWidth="180px"
            tooltipTitle={`Click to view kisan details: ${text}`}
          >
            <LinkOutlined style={{ fontSize: 12 }} />
            {text}
          </EllipsisText>
        ),
      },
      {
        title: <FormattedMessage id="purchaserName" defaultMessage="Purchaser Name" />,
        dataIndex: 'purchaserName',
        key: 'purchaserName',
        width: '20%',
        render: (text, record) => (
          <EllipsisText
            style={{
              color: '#1677ff',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
            className="clickable-field"
            onClick={() => handlePurchaserClick(text, record.purchaserId)}
            maxWidth="180px"
            tooltipTitle={`Click to view purchaser details: ${text}`}
          >
            <LinkOutlined style={{ fontSize: 12 }} />
            {text}
          </EllipsisText>
        ),
      },
      {
        title: <FormattedMessage id="date" defaultMessage="Date" />,
        dataIndex: 'date',
        key: 'date',
        width: '15%',
        render: date => (
          <Tag color="blue" style={{ margin: 0 }}>
            {dateConverter(date)}
          </Tag>
        ),
      },
      {
        title: <FormattedMessage id="weight" defaultMessage="Weight" />,
        dataIndex: 'totalweight',
        key: 'totalweight',
        width: '12%',
        align: 'right',
        render: weight => (
          <Text style={{ fontWeight: 500 }}>
            {weight} <FormattedMessage id="kg" defaultMessage="kg" />
          </Text>
        ),
      },
      {
        title: <FormattedMessage id="numberOfBags" defaultMessage="Number of Bags" />,
        dataIndex: 'numberofBags',
        key: 'numberofBags',
        width: '12%',
        align: 'center',
        render: bags => <Text style={{ fontWeight: 500 }}>{bags}</Text>,
      },
      {
        title: <FormattedMessage id="ratePerKg" defaultMessage="Rate per Kg" />,
        dataIndex: 'rate',
        key: 'rate',
        width: '12%',
        align: 'right',
        render: rate => (
          <Text style={{ fontWeight: 500, color: '#52c41a' }}>
            ₹{rate}/<FormattedMessage id="kg" defaultMessage="kg" />
          </Text>
        ),
      },
    ],
    [handleKisanClick, handlePurchaserClick]
  );

  // Transform data for display (no need for sorting since backend handles it)
  const dataSource = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];

    return transactions.map((transaction, index) => ({
      key: transaction._id || index,
      ...transaction,
    }));
  }, [transactions]);

  // Handle pagination changes
  const handlePageChange = useCallback(
    (page, size) => {
      setCurrentPage(page);
      if (size !== pageSize) {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
      }
    },
    [pageSize]
  );

  const handlePageSizeChange = useCallback(
    (current, size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchPaginatedTransactions(1, size);
    },
    [fetchPaginatedTransactions]
  );

  // Render card view for mobile
  const renderCardView = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobileOrTablet ? 4 : 12, // Less gap in mobile
          width: '100%',
          padding: isMobileOrTablet ? '0' : '0 12px',
        }}
      >
        {dataSource.map((transaction, index) => {
          // Calculate global index for display
          const globalIndex = (currentPage - 1) * pageSize + index + 1;
          return (
            <Card
              key={transaction.key}
              size="small"
              hoverable
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid #d9d9d9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                margin: isMobileOrTablet ? '2px 0' : undefined, // Less margin in mobile
              }}
              bodyStyle={{ padding: 16, width: '100%' }}
            >
              <Card.Meta
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#000', fontSize: 16, fontWeight: 600 }}>
                      #{globalIndex}
                    </span>
                    <Tag color="blue" style={{ marginRight: 0 }}>
                      {dateConverter(transaction.date)}
                    </Tag>
                  </div>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    {/* Kisan Name */}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                    >
                      <span style={{ color: '#666', fontSize: 13 }}>
                        <FormattedMessage id="kisanDetailsTitle" defaultMessage="Kisan" />:
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          color: '#1677ff',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                        }}
                        className="clickable-field"
                        onClick={() => handleKisanClick(transaction.kisanName, transaction.kisanID)}
                        title="Click to view kisan details"
                      >
                        <LinkOutlined style={{ fontSize: 13 }} />
                        {transaction.kisanName}
                      </span>
                    </div>

                    {/* Purchaser Name */}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                    >
                      <span style={{ color: '#666', fontSize: 13 }}>
                        <FormattedMessage id="purchaserName" defaultMessage="Purchaser" />:
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          color: '#1677ff',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                        }}
                        className="clickable-field"
                        onClick={() =>
                          handlePurchaserClick(transaction.purchaserName, transaction.purchaserId)
                        }
                        title="Click to view purchaser details"
                      >
                        <LinkOutlined style={{ fontSize: 13 }} />
                        {transaction.purchaserName}
                      </span>
                    </div>

                    {/* Transaction Details */}
                    <div
                      style={{
                        marginTop: 8,
                        padding: 8,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 6,
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 4,
                          fontSize: 13,
                        }}
                      >
                        <div>
                          <strong>
                            <FormattedMessage id="weight" defaultMessage="Weight" />:
                          </strong>{' '}
                          {transaction.totalweight} <FormattedMessage id="kg" defaultMessage="kg" />
                        </div>
                        <div>
                          <strong>
                            <FormattedMessage id="numberOfBags" defaultMessage="Bags" />:
                          </strong>{' '}
                          {transaction.numberofBags}
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <strong>
                            <FormattedMessage id="rate" defaultMessage="Rate" />:
                          </strong>{' '}
                          ₹{transaction.rate}/<FormattedMessage id="kg" defaultMessage="kg" />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          );
        })}
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return <SimpleShimmer />;
  }

  // Show empty state only after loading is complete and there are no transactions
  if (!isLoading && (!transactions || transactions.length === 0)) {
    return (
      <div>
        <Card style={{ textAlign: 'center', padding: '24px', borderRadius: 12 }}>
          <InfoCircleOutlined style={{ fontSize: 48, color: '#8c8c8c', marginBottom: 16 }} />
          <Title level={4} type="secondary">
            <FormattedMessage
              id="noInventoryForThisItem"
              defaultMessage="No Inventory for This Item"
            />
          </Title>
          <Text type="secondary">
            <FormattedMessage
              id="noTransactionsFound"
              defaultMessage="No transactions found for this inventory item."
            />
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ fontSize: 18, color: '#1677ff' }} />
            <Title level={5} style={{ margin: 0, color: '#000', fontWeight: 600 }}>
              <FormattedMessage
                id="inventoryTransactions"
                defaultMessage="Inventory Transactions"
              />
            </Title>
          </div>
        }
        extra={
          !isMobileOrTablet ? (
            <Button
              type="link"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              size="large"
              style={{
                fontWeight: 600,
                color: '#1677ff',
              }}
            >
              <FormattedMessage id="common.print" defaultMessage="Print Transactions" />
            </Button>
          ) : null
        }
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 12 }}
      >
        {/* View Toggle Buttons - Only show on mobile/tablet */}
        {isMobileOrTablet && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 16,
              padding: '16px 24px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Button.Group size="small" style={{ marginBottom: 12 }}>
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

            {/* Print Button for Mobile */}
            <Button
              type="link"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              size="large"
              block
              style={{
                fontWeight: 600,
                color: '#1677ff',
                marginBottom: 12,
              }}
            >
              <FormattedMessage id="common.print" defaultMessage="Print Transactions" />
            </Button>
          </div>
        )}

        {/* Render based on view mode and screen size */}
        <div
          style={{
            padding: isMobileOrTablet && viewMode === 'card' ? '0 15px 24px' : '0 24px 24px',
            marginTop: 16,
          }}
        >
          {isMobileOrTablet && viewMode === 'card' ? (
            <div>
              {renderCardView()}
              {/* Summary row for card view */}
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#fafafa',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  <FormattedMessage
                    id="inventoryTransactions"
                    defaultMessage="Inventory Transactions"
                  />{' '}
                  ({totalTransactions})
                </span>
                <span style={{ color: '#888', fontSize: 14 }}>
                  <FormattedMessage
                    id="ofTransactions"
                    defaultMessage="{current} of {total} transactions"
                    values={{
                      current: Math.min(
                        (currentPage - 1) * pageSize + dataSource.length,
                        totalTransactions
                      ),
                      total: totalTransactions,
                    }}
                  />
                </span>
              </div>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: true }}
              style={{ background: '#fff', borderRadius: 8 }}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={columns.length - 2}>
                      <span style={{ fontWeight: 600 }}>
                        <FormattedMessage
                          id="inventoryTransactions"
                          defaultMessage="Inventory Transactions"
                        />{' '}
                        ({totalTransactions})
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={columns.length - 2} colSpan={2} align="right">
                      <span style={{ color: '#888' }}>
                        <FormattedMessage
                          id="ofTransactions"
                          defaultMessage="{current} of {total} transactions"
                          values={{
                            current: Math.min(
                              (currentPage - 1) * pageSize + dataSource.length,
                              totalTransactions
                            ),
                            total: totalTransactions,
                          }}
                        />
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
            />
          )}

          {/* Responsive Pagination Section */}
          <Row justify="space-between" align="middle" style={{ marginTop: 16 }} gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isMobileOrTablet ? 'center' : 'flex-start',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: isMobileOrTablet ? 14 : 16 }}>
                  <FormattedMessage id="show" defaultMessage="Show" />
                </span>
                <Select
                  value={pageSize}
                  onChange={value => {
                    setPageSize(value);
                    setCurrentPage(1);
                  }}
                  style={{ width: isMobileOrTablet ? 70 : 80 }}
                  size={isMobileOrTablet ? 'small' : 'middle'}
                >
                  {[10, 20, 50, 100].map(size => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
                <span style={{ fontSize: isMobileOrTablet ? 14 : 16 }}>
                  <FormattedMessage id="entries" defaultMessage="entries" />
                </span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={16} lg={18}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: isMobileOrTablet ? 'center' : 'flex-end',
                  width: '100%',
                }}
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalTransactions}
                  showSizeChanger={false}
                  onChange={handlePageChange}
                  size={isMobileOrTablet ? 'small' : 'default'}
                  showQuickJumper={!isMobileOrTablet}
                  showTotal={(total, range) =>
                    !isMobileOrTablet ? (
                      <span style={{ marginRight: 16, color: '#666' }}>
                        {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, total)} of ${total} transactions`}
                      </span>
                    ) : null
                  }
                  responsive={true}
                />
              </div>
            </Col>
          </Row>
        </div>

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

          /* Ensure proper padding for table container */
          .ant-table-wrapper {
            padding: 0;
          }

          .ant-table-tbody > tr:last-child > td {
            border-bottom: 1px solid #f0f0f0;
          }

          .ant-table-summary > tr > td {
            padding: 12px 16px !important;
            border-top: 2px solid #f0f0f0;
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
        `}</style>
      </Card>
    </div>
  );
};

export default InventoryTable;
