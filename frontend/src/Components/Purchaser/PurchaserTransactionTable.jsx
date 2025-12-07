import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Table as AntdTable,
  Button as AntdButton,
  Tooltip as AntdTooltip,
  Spin,
  Divider as AntdDivider,
  Modal as AntdModal,
  Card,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { dateConverter, toFixed } from '../../Utility/utility';
import PurchaserBill from './PurchaserBill';
import { FormattedMessage, useIntl } from 'react-intl';
import { useReactToPrint } from 'react-to-print';
import { Shimmer, EllipsisText } from '../Common';
import './PurchaserTransactionTable.css';

const Purchasertransactiontable = ({
  purchaser,
  purchaserDetails,
  updatePurchaser,
  mobileTransactionView = 'card',
  isMobileOrTablet = false,
}) => {
  const [transaction, setTransaction] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const creditPrintRef = useRef();
  const intl = useIntl();
  useEffect(() => {
    if (purchaser !== null && purchaser !== undefined) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [purchaser]);

  const printCreditEntry = currentTransaction => {
    const transaction = {
      name: purchaserDetails.name,
      balance: purchaserDetails.balance,
      companyName: purchaserDetails.companyName,
      phone: purchaserDetails.phone,
      address: purchaserDetails.address,
      transaction: currentTransaction.transactions,
      date: currentTransaction.date,
      type: currentTransaction.type,
      oldBalance: calculateBalance(currentTransaction),
      billId: currentTransaction.transactions[currentTransaction.transactions.length - 1]._id,
      debitSum: calculateTotals(currentTransaction, 'db'),
      creditSum: calculateTotals(currentTransaction, 'cr'),
    };
    setTransaction({ ...transaction });
  };
  const calculateTotals = (currentTransaction, type) => {
    let dbSum = 0;
    let crSum = 0;
    if (currentTransaction.transactions.length > 0) {
      currentTransaction.transactions.forEach(trn => {
        if (trn.type === 'DEBIT') {
          dbSum += trn.transactionAmount;
        } else {
          crSum += trn.transactionAmount;
        }
      });
    }
    return type === 'db' ? dbSum : crSum;
  };

  const calculateBalance = currentTransaction => {
    let oldBalance = 0;
    const Index = currentTransaction.transactions.length - 1;
    const oldBalanceEntry = currentTransaction.transactions[Index].balanceAfterThisTransaction;
    if (currentTransaction.transactions[Index].type === 'CREDIT') {
      oldBalance = oldBalanceEntry - currentTransaction.transactions[Index].transactionAmount;
    } else {
      oldBalance = oldBalanceEntry + currentTransaction.transactions[Index].transactionAmount;
    }
    return oldBalance;
  };

  const showDeleteConfirm = txn => {
    setTransactionToDelete(txn);
    setDeleteModalVisible(true);
  };

  const deletePurchaserPaymentTransaction = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      const formData = {
        purchaserId: purchaserDetails._id,
        purchaserTxnId: transactionToDelete._id,
      };

      const response = await fetch(`/purchaser/DeleteTransacton`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      updatePurchaser();
      setDeleteModalVisible(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Delete transaction error:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    if (Object.keys(transaction).length > 0) {
      console.log('Transaction ', transaction);
      handlePrintCreditEntry();
    }
  }, [transaction]);
  const handlePrintCreditEntry = useReactToPrint({
    content: () => creditPrintRef.current,
  });
  const showDeleteButton = (index, mainIndex) => {
    if (mainIndex === 0 && index === 0) {
      return true;
    }
    return false;
  };
  // Ant Design table columns configuration
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, record, index) => {
        if (record.isDateSeparator) return null;
        // Calculate the actual index excluding date separator rows
        const actualIndex =
          prepareUnifiedTableData()
            .slice(0, index)
            .filter(item => !item.isDateSeparator).length + 1;
        return actualIndex;
      },
    },
    {
      title: <FormattedMessage id="date" />,
      dataIndex: 'date',
      key: 'date',
      render: (date, record) => {
        if (record.isDateSeparator) return null;
        return dateConverter(date);
      },
    },
    {
      title: <FormattedMessage id="comment" />,
      dataIndex: 'comment',
      key: 'comment',
      render: (comment, record) => {
        if (record.isDateSeparator) return null;
        return <EllipsisText maxWidth="200px">{comment || '-'}</EllipsisText>;
      },
    },
    {
      title: <FormattedMessage id="kisanName" />,
      key: 'kisan',
      render: (_, record) => {
        if (record.isDateSeparator) return null;
        return (
          <Link to={`/kisanDetails/${record.kisan}`}>
            <EllipsisText maxWidth="150px">{record.kisanName}</EllipsisText>
          </Link>
        );
      },
    },
    {
      title: <FormattedMessage id="totalWeight" />,
      dataIndex: 'totalweight',
      key: 'totalweight',
      render: (totalweight, record) => {
        if (record.isDateSeparator) return null;
        return totalweight;
      },
    },
    {
      title: <FormattedMessage id="numberOfBags" />,
      dataIndex: 'numberofBags',
      key: 'numberofBags',
      render: (numberofBags, record) => {
        if (record.isDateSeparator) return null;
        return numberofBags;
      },
    },
    {
      title: <FormattedMessage id="ratePerKg" />,
      dataIndex: 'rate',
      key: 'rate',
      render: (rate, record) => {
        if (record.isDateSeparator) return null;
        return rate;
      },
    },
    {
      title: <FormattedMessage id="purchaseTotal" />,
      dataIndex: 'transactionAmount',
      key: 'transactionAmount',
      render: (amount, record) => {
        if (record.isDateSeparator) return null;
        return `₹${toFixed(amount)}`;
      },
    },
    {
      title: <FormattedMessage id="transactionType" />,
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => {
        if (record.isDateSeparator) return null;
        return (
          <span
            className={`transaction-status-badge ${type === 'CREDIT' ? 'payment' : 'purchase'}`}
          >
            {type === 'CREDIT' ? (
              <FormattedMessage id="tt_payment" />
            ) : (
              <FormattedMessage id="tt_purchase" />
            )}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="outstandingPaymentADT" />,
      dataIndex: 'balanceAfterThisTransaction',
      key: 'balance',
      render: (balance, record) => {
        if (record.isDateSeparator) return null;
        return (
          <span className={balance < 0 ? 'balance-negative' : 'balance-positive'}>
            ₹{toFixed(balance)}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="actions" />,
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record, index) => {
        if (record.isDateSeparator) return null;

        const mainIndex = purchaser.findIndex(p => p.transactions.some(t => t._id === record._id));
        const transactionIndex =
          purchaser[mainIndex]?.transactions.findIndex(t => t._id === record._id) || 0;

        if (record.type === 'CREDIT' && showDeleteButton(transactionIndex, mainIndex)) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AntdTooltip title={intl.formatMessage({ id: 'delete' })}>
                <AntdButton
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  loading={isDeleting}
                  onClick={() => showDeleteConfirm(record)}
                  size="small"
                />
              </AntdTooltip>
            </div>
          );
        }
        return null;
      },
    },
  ];

  // ...existing code...

  // Prepare unified table data with date separators as special rows
  const prepareUnifiedTableData = () => {
    const unifiedData = [];

    purchaser
      .sort((a, b) => {
        const dateA = a.date.toString().split('/');
        const dateB = b.date.toString().split('/');
        return dateB[2] - dateA[2] || dateB[1] - dateA[1] || dateB[0] - dateA[0];
      })
      .forEach((purchaserGroup, groupIndex) => {
        // Add date separator row
        unifiedData.push({
          key: `date-separator-${groupIndex}`,
          isDateSeparator: true,
          date: purchaserGroup.date,
          groupData: purchaserGroup,
        });

        // Add transaction rows for this date group
        const sortedTransactions = purchaserGroup.transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        sortedTransactions.forEach(transaction => {
          unifiedData.push({
            ...transaction,
            key: transaction._id,
            groupDate: purchaserGroup.date,
          });
        });
      });

    return unifiedData;
  };

  // Mobile card renderer with improved styling
  const renderMobileCard = (transaction, index) => (
    <div key={transaction._id} className="purchaser-transaction-card">
      <div className="purchaser-transaction-card-title">
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          #{index + 1} - {dateConverter(transaction.date)}
        </span>
        <span
          className={`transaction-status-badge ${transaction.type === 'CREDIT' ? 'payment' : 'purchase'}`}
        >
          {transaction.type === 'CREDIT'
            ? intl.formatMessage({ id: 'tt_payment' })
            : intl.formatMessage({ id: 'tt_purchase' })}
        </span>
      </div>

      <div className="purchaser-transaction-card-content">
        <div className="purchaser-transaction-card-field">
          <span className="purchaser-transaction-card-label">
            <FormattedMessage id="kisanName" />
          </span>
          <span className="purchaser-transaction-card-value">
            <Link to={`/kisanDetails/${transaction.kisan}`} style={{ color: '#1890ff' }}>
              <EllipsisText maxWidth="150px">{transaction.kisanName}</EllipsisText>
            </Link>
          </span>
        </div>

        {transaction.comment && (
          <div className="purchaser-transaction-card-field">
            <span className="purchaser-transaction-card-label">
              <FormattedMessage id="comment" />
            </span>
            <span className="purchaser-transaction-card-value">
              <EllipsisText maxWidth="200px">{transaction.comment}</EllipsisText>
            </span>
          </div>
        )}

        {/* Only show weight, bags, and rate for purchase transactions (not payments) */}
        {transaction.type !== 'CREDIT' && (
          <>
            <div className="purchaser-transaction-card-field">
              <span className="purchaser-transaction-card-label">
                <FormattedMessage id="totalWeight" />
              </span>
              <span className="purchaser-transaction-card-value">{transaction.totalweight}</span>
            </div>

            <div className="purchaser-transaction-card-field">
              <span className="purchaser-transaction-card-label">
                <FormattedMessage id="numberOfBags" />
              </span>
              <span className="purchaser-transaction-card-value">{transaction.numberofBags}</span>
            </div>

            <div className="purchaser-transaction-card-field">
              <span className="purchaser-transaction-card-label">
                <FormattedMessage id="ratePerKg" />
              </span>
              <span className="purchaser-transaction-card-value">{transaction.rate}</span>
            </div>
          </>
        )}

        <div className="purchaser-transaction-card-field">
          <span className="purchaser-transaction-card-label">
            <FormattedMessage id="purchaseTotal" />
          </span>
          <span className="purchaser-transaction-card-value">
            ₹{toFixed(transaction.transactionAmount)}
          </span>
        </div>

        <div className="purchaser-transaction-card-field" style={{ gridColumn: '1 / -1' }}>
          <span className="purchaser-transaction-card-label">
            <FormattedMessage id="outstandingPaymentADT" />
          </span>
          <span
            className={`purchaser-transaction-card-value ${
              transaction.balanceAfterThisTransaction < 0 ? 'balance-negative' : 'balance-positive'
            }`}
          >
            ₹{toFixed(transaction.balanceAfterThisTransaction)}
          </span>
        </div>
      </div>

      {/* Action button for mobile */}
      {transaction.type === 'CREDIT' &&
        showDeleteButton(
          purchaser
            .find(p => p.transactions.some(t => t._id === transaction._id))
            ?.transactions.findIndex(t => t._id === transaction._id) || 0,
          purchaser.findIndex(p => p.transactions.some(t => t._id === transaction._id))
        ) && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <AntdButton
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              onClick={() => showDeleteConfirm(transaction)}
              size="small"
            >
              Delete
            </AntdButton>
          </div>
        )}
    </div>
  );

  return (
    <div className="purchaser-transaction-table-wrapper">
      {isLoading ? (
        <div className="purchaser-transaction-shimmer">
          {/* Desktop table shimmer */}
          {!isMobileOrTablet && (
            <div className="shimmer-table-container">
              {/* Table header shimmer */}
              <div className="shimmer-table-header">
                <Shimmer width={40} height={16} />
                <Shimmer width={80} height={16} />
                <Shimmer width={120} height={16} />
                <Shimmer width={90} height={16} />
                <Shimmer width={80} height={16} />
                <Shimmer width={80} height={16} />
                <Shimmer width={80} height={16} />
                <Shimmer width={90} height={16} />
                <Shimmer width={80} height={16} />
                <Shimmer width={100} height={16} />
                <Shimmer width={80} height={16} />
              </div>

              {/* Date group shimmer */}
              <div className="shimmer-date-group">
                <Shimmer width={120} height={20} borderRadius={6} />
              </div>

              {/* Table rows shimmer */}
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="shimmer-table-row">
                  <Shimmer width={30} height={16} />
                  <Shimmer width={80} height={16} />
                  <Shimmer width={100} height={16} />
                  <Shimmer width={80} height={16} />
                  <Shimmer width={70} height={16} />
                  <Shimmer width={70} height={16} />
                  <Shimmer width={70} height={16} />
                  <Shimmer width={80} height={16} />
                  <Shimmer width={60} height={16} borderRadius={12} />
                  <Shimmer width={90} height={16} />
                  <Shimmer width={60} height={32} borderRadius={6} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile card shimmer */}
          {isMobileOrTablet && (
            <div className="shimmer-cards-container">
              {/* Date group shimmer */}
              <div className="shimmer-date-group-mobile">
                <Shimmer width={120} height={20} borderRadius={6} />
              </div>

              {/* Card shimmers */}
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="shimmer-card">
                  <div className="shimmer-card-header">
                    <Shimmer width={100} height={18} />
                    <Shimmer width={60} height={16} borderRadius={12} />
                  </div>
                  <div className="shimmer-card-content">
                    <div className="shimmer-card-row">
                      <Shimmer width={60} height={14} />
                      <Shimmer width={80} height={14} />
                    </div>
                    <div className="shimmer-card-row">
                      <Shimmer width={70} height={14} />
                      <Shimmer width={90} height={14} />
                    </div>
                    <div className="shimmer-card-row">
                      <Shimmer width={80} height={14} />
                      <Shimmer width={100} height={14} />
                    </div>
                  </div>
                  <div className="shimmer-card-actions">
                    <Shimmer width={60} height={28} borderRadius={6} />
                    <Shimmer width={60} height={28} borderRadius={6} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {purchaser.length > 0 ? (
            <>
              {/* Mobile view - Cards */}
              {mobileTransactionView === 'card' && isMobileOrTablet ? (
                <div>
                  {purchaser
                    .sort((a, b) => {
                      const dateA = a.date.toString().split('/');
                      const dateB = b.date.toString().split('/');
                      return dateB[2] - dateA[2] || dateB[1] - dateA[1] || dateB[0] - dateA[0];
                    })
                    .map((purchaserGroup, groupIndex) => (
                      <div key={groupIndex} style={{ marginBottom: 24 }}>
                        {/* Date separator with print button */}
                        <div
                          className="purchaser-date-separator"
                          style={{
                            marginBottom: 16,
                            padding: '12px 16px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <strong style={{ color: '#343a40', fontSize: '14px' }}>
                              <FormattedMessage id="date" />: {purchaserGroup.date}
                            </strong>
                            <AntdButton
                              type="primary"
                              icon={<PrinterOutlined />}
                              onClick={() => printCreditEntry(purchaserGroup)}
                              size="small"
                              style={{ cursor: 'pointer' }}
                            >
                              <FormattedMessage id="printButtonText" />
                            </AntdButton>
                          </div>
                        </div>

                        {/* Render transaction cards */}
                        <div>
                          {purchaserGroup.transactions
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((transaction, index) => renderMobileCard(transaction, index))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                /* Table view - Desktop always shows table, Mobile shows when table option selected */
                <AntdTable
                  columns={columns}
                  dataSource={prepareUnifiedTableData()}
                  pagination={false}
                  size="small"
                  scroll={{ x: 800 }}
                  showHeader={true}
                  rowClassName={record => {
                    if (record.isDateSeparator) return 'purchaser-date-separator-row';
                    return '';
                  }}
                  components={{
                    body: {
                      row: ({ children, className, ...props }) => {
                        if (className?.includes('purchaser-date-separator-row')) {
                          // Find the record data from dataSource
                          const record = prepareUnifiedTableData().find(
                            item => item.key === props['data-row-key']
                          );

                          return (
                            <tr className="purchaser-date-separator-row">
                              <td
                                colSpan={columns.length}
                                className="purchaser-date-separator-cell"
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#343a40',
                                      fontSize: '14px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <FormattedMessage id="date" />: {record?.date}
                                  </span>
                                  <AntdButton
                                    type="primary"
                                    icon={<PrinterOutlined />}
                                    onClick={() => printCreditEntry(record?.groupData)}
                                    size="small"
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <FormattedMessage id="printButtonText" />
                                  </AntdButton>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return (
                          <tr className={className} {...props}>
                            {children}
                          </tr>
                        );
                      },
                    },
                  }}
                />
              )}
            </>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', color: '#ff4d4f', padding: '40px 0' }}>
                <h4>
                  <FormattedMessage
                    id="noTransactionsAvailable"
                    defaultMessage="No Transactions Available For This Purchaser."
                  />
                </h4>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AntdModal
        title={<FormattedMessage id="confirmDelete" defaultMessage="Confirm Delete" />}
        open={deleteModalVisible}
        onOk={deletePurchaserPaymentTransaction}
        onCancel={() => {
          setDeleteModalVisible(false);
          setTransactionToDelete(null);
        }}
        confirmLoading={isDeleting}
        okText={<FormattedMessage id="delete" defaultMessage="Delete" />}
        cancelText={<FormattedMessage id="cancel" defaultMessage="Cancel" />}
        okButtonProps={{ danger: true }}
      >
        <p>
          <FormattedMessage
            id="deleteTransactionConfirm"
            defaultMessage="Are you sure you want to delete this transaction? This action cannot be undone."
          />
        </p>
      </AntdModal>

      {/* Hidden print component */}
      <div style={{ display: 'none' }}>
        <PurchaserBill data={transaction} ref={creditPrintRef} />
      </div>
    </div>
  );
};

export default Purchasertransactiontable;
