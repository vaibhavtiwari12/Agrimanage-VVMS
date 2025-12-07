import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Table as AntdTable,
  Button as AntdButton,
  Tooltip as AntdTooltip,
  Spin,
  Divider as AntdDivider,
  Modal as AntdModal,
  Dropdown as AntdDropdown,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { dateConverter, toFixed } from '../../../Utility/utility';
import Kisanreceipt from './KisanReceipt';
import Kisancreditreceipt from './KisanCreditReceipt';
import KisanCreditReceiptThermal from './KisanCreditReceiptThermal';
import { FormattedMessage } from 'react-intl';
import { useReactToPrint } from 'react-to-print';
import './kisanDetailsClean.css';
import { Shimmer, EllipsisText } from '../../Common';

const Kisantransactionstable = ({
  kisan,
  updateKisan,
  mobileTransactionView = 'table',
  isMobileOrTablet = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [printType, setPrintType] = useState('fullpage'); // 'fullpage' or 'thermal'
  const componentRef = useRef();
  const creditPrintRef = useRef();
  const creditThermalPrintRef = useRef();

  const print = currentTransaction => {
    setTransaction({
      address: kisan.address,
      balance: kisan.balance,
      fatherName: kisan.fatherName,
      name: kisan.name,
      phone: kisan.phone,
      date: dateConverter(currentTransaction.date),
      transactionAmount: currentTransaction.transactionAmount,
      type: currentTransaction.type,
    });
  };
  const printCreditEntry = currentTransaction => {
    setTransaction({
      address: kisan.address,
      balance: kisan.balance,
      fatherName: kisan.fatherName,
      name: kisan.name,
      phone: kisan.phone,
      txn_id: currentTransaction._id,
      txn_date: dateConverter(currentTransaction.date),
      txn_previousBillSettlementAmount: currentTransaction.previousBillSettlementAmount,
      txn_itemType: currentTransaction.itemType,
      txn_numberofBags: currentTransaction.numberofBags,
      txn_totalWeight: currentTransaction.totalweight,
      txn_rate: currentTransaction.rate,
      txn_grossTotal: currentTransaction.grossTotal,
      txn_commission: currentTransaction.commission,
      txn_hammali: currentTransaction.hammali,
      txn_bhada: currentTransaction.bhada,
      txn_netTotal: currentTransaction.netTotal,
      txn_advanceSettlement: currentTransaction.advanceSettlement,
      txn_carryForwardFromThisEntry: currentTransaction.carryForwardFromThisEntry,
      txn_paidToKisan: currentTransaction.paidToKisan,
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrintCreditEntry = useReactToPrint({
    content: () => creditPrintRef.current,
  });
  const handlePrintCreditThermal = useReactToPrint({
    content: () => creditThermalPrintRef.current,
  });

  useEffect(() => {
    if (kisan !== null && kisan !== undefined) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [kisan]);

  useEffect(() => {
    if (Object.keys(transaction).length > 0) {
      if (transaction && transaction.type === 'DEBIT') {
        handlePrint();
      } else {
        // For credit entries, check print type
        if (printType === 'thermal') {
          handlePrintCreditThermal();
        } else {
          handlePrintCreditEntry();
        }
      }
    }
  }, [transaction]);

  const deleteTransaction = (txn, kisanId) => {
    setIsDeleting(true);
    const formData = {
      kisanTxnId: txn._id,
      purchaserId: txn.purchaserId,
      purchaserTxnId: txn.purchaserTxnId,
      inventoryItemId: txn.inventoryItemId,
      inventoryTxnId: txn.inventoryTxnId,
    };
    fetch(`/kisan/DeleteTransacton/${kisanId}`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => updateKisan())
      .catch(() => setIsDeleting(false));
  };
  const deleteTransactionAdvanceSettlement = (txn, kisanId) => {
    setIsDeleting(true);
    const formData = { kisanId: kisanId, transactionID: txn._id };
    fetch(`/kisan/DeleteAdvanceSettlementTransaction`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => updateKisan())
      .catch(() => setIsDeleting(false));
  };
  const deleteTransactionDebit = (txn, kisanId) => {
    setIsDeleting(true);
    const formData = { kisanId: kisanId, transactionID: txn._id };
    fetch(`/kisan/DeleteDebitTransaction`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => updateKisan())
      .catch(() => setIsDeleting(false));
  };

  // Helper: Show confirmation modal before delete
  const showDeleteConfirm = (txn, kisanId, type) => {
    AntdModal.confirm({
      title: 'Are you sure you want to delete this transaction?',
      content: (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>Date:</b> {dateConverter(txn.date)}
          </div>
          <div>
            <b>Type:</b> {txn.type}
          </div>
          <div>
            <b>Amount:</b> ₹
            {toFixed(txn.transactionAmount || txn.advanceSettlement || txn.netTotal || 0)}
          </div>
          <div>
            <b>Comment:</b> {txn.comment || '-'}
          </div>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        if (type === 'DEBIT') deleteTransactionDebit(txn, kisanId);
        else if (type === 'ADVANCESETTLEMENT') deleteTransactionAdvanceSettlement(txn, kisanId);
        else deleteTransaction(txn, kisanId);
      },
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, idx) => idx + 1,
      align: 'center',
    },
    {
      title: <FormattedMessage id="date" />,
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      render: date => dateConverter(date),
    },
    {
      title: <FormattedMessage id="comment" />,
      dataIndex: 'comment',
      key: 'comment',
      align: 'center',
    },
    {
      title: <FormattedMessage id="advanceDebited" />,
      dataIndex: 'transactionAmount',
      key: 'advanceDebited',
      align: 'center',
      render: (val, row) => (row.type === 'DEBIT' ? `₹${toFixed(val)}` : ''),
    },
    {
      title: <FormattedMessage id="grossTotalWithCurrency" />,
      dataIndex: 'grossTotal',
      key: 'grossTotal',
      align: 'center',
      render: val => `₹${toFixed(val || 0)}`,
    },
    {
      title: <FormattedMessage id="billTotal" />,
      dataIndex: 'netTotal',
      key: 'billTotal',
      align: 'center',
      render: val => `₹${toFixed(val || 0)}`,
    },
    {
      title: <FormattedMessage id="advanceCredited" />,
      dataIndex: 'advanceSettlement',
      key: 'advanceCredited',
      align: 'center',
      render: (val, row) =>
        row.type === 'CREDIT'
          ? `₹${toFixed(val || 0)}`
          : row.type === 'ADVANCESETTLEMENT'
            ? `₹${toFixed(row.transactionAmount || 0)}`
            : '',
    },
    {
      title: <FormattedMessage id="cashPaid" />,
      dataIndex: 'paidToKisan',
      key: 'cashPaid',
      align: 'center',
      render: val =>
        val > 0 ? (
          <span className="cash-paid-green">₹{toFixed(val)}</span>
        ) : (
          <span>₹{toFixed(val || 0)}</span>
        ),
    },
    {
      title: <FormattedMessage id="carryForwardFromThisBill" />,
      dataIndex: 'netTotal',
      key: 'carryForwardFromThisBill',
      align: 'center',
      render: (val, row) =>
        row.type === 'CREDIT' && row.netTotal > 0
          ? `₹${toFixed((row.netTotal || 0) - (row.advanceSettlement || 0) - (row.paidToKisan || 0))}`
          : 0,
    },
    {
      title: <FormattedMessage id="carryForward" />,
      dataIndex: 'carryForwardFromThisEntry',
      key: 'carryForward',
      align: 'center',
      render: val => `₹${toFixed(val || 0)}`,
    },
    {
      title: <FormattedMessage id="balance" />,
      dataIndex: 'balanceAfterThisTransaction',
      key: 'balance',
      align: 'center',
      render: val => (
        <span className={val < 0 ? 'text-danger' : 'text-primary'}>{`₹${toFixed(val || 0)}`}</span>
      ),
    },
    {
      title: <FormattedMessage id="actions" />,
      key: 'actions',
      align: 'left',
      render: (_, transaction, index) => {
        if (transaction.type === 'DEBIT') {
          return (
            <div style={{ display: 'flex', gap: 8 }}>
              <AntdTooltip title={<FormattedMessage id="editButtonText" defaultMessage="Edit" />}>
                <Link
                  className="link-no-decoration"
                  to={`/kisanDebitForm/${kisan._id}/edit/${transaction._id}`}
                >
                  <AntdButton
                    icon={<EditOutlined />}
                    size="middle"
                    type="default"
                    ghost
                    style={{ borderColor: '#faad14', color: '#faad14' }}
                    className="edit-btn-debit"
                  />
                </Link>
              </AntdTooltip>
              <AntdTooltip title={<FormattedMessage id="printButtonText" defaultMessage="Print" />}>
                <AntdButton
                  icon={<PrinterOutlined />}
                  style={{ borderColor: '#1890ff', color: '#1890ff' }}
                  onClick={() => print(transaction)}
                  size="middle"
                  type="default"
                />
              </AntdTooltip>
              {index === 0 &&
                (isDeleting ? (
                  <AntdButton danger loading size="middle" />
                ) : (
                  <AntdButton
                    danger
                    icon={<DeleteOutlined />}
                    size="middle"
                    onClick={() => showDeleteConfirm(transaction, kisan._id, 'DEBIT')}
                  />
                ))}
            </div>
          );
        } else if (transaction.type === 'ADVANCESETTLEMENT') {
          return (
            <div style={{ display: 'flex', gap: 8 }}>
              <AntdTooltip title={<FormattedMessage id="editButtonText" defaultMessage="Edit" />}>
                <Link
                  className="link-no-decoration"
                  to={`/kisanAdvanceSettlement/${kisan._id}/edit/${transaction._id}`}
                >
                  <AntdButton
                    icon={<EditOutlined />}
                    size="middle"
                    type="default"
                    ghost
                    style={{ borderColor: '#faad14', color: '#faad14' }}
                    className="edit-btn-debit"
                  />
                </Link>
              </AntdTooltip>
              {index === 0 &&
                (isDeleting ? (
                  <AntdButton danger loading size="middle" />
                ) : (
                  <AntdButton
                    danger
                    icon={<DeleteOutlined />}
                    size="middle"
                    onClick={() => showDeleteConfirm(transaction, kisan._id, 'ADVANCESETTLEMENT')}
                  />
                ))}
            </div>
          );
        } else {
          const printMenuItems = [
            {
              key: 'fullpage',
              label: 'Full Page Print',
              onClick: () => {
                setPrintType('fullpage');
                printCreditEntry(transaction);
              },
            },
            {
              key: 'thermal',
              label: 'Thermal Print (80mm)',
              onClick: () => {
                setPrintType('thermal');
                printCreditEntry(transaction);
              },
            },
          ];

          return (
            <div style={{ display: 'flex', gap: 8 }}>
              <AntdTooltip title={<FormattedMessage id="editButtonText" defaultMessage="Edit" />}>
                <Link
                  className="link-no-decoration"
                  to={`/kisanCreditForm/${kisan._id}/edit/${transaction._id}`}
                >
                  <AntdButton
                    icon={<UnorderedListOutlined />}
                    size="middle"
                    type="default"
                    ghost
                    style={{ borderColor: '#faad14', color: '#faad14' }}
                    className="edit-btn-credit"
                  />
                </Link>
              </AntdTooltip>
              <AntdDropdown menu={{ items: printMenuItems }} trigger={['click']}>
                <AntdButton
                  icon={<PrinterOutlined />}
                  style={{ borderColor: '#1890ff', color: '#1890ff' }}
                  size="middle"
                  type="default"
                >
                  <DownOutlined style={{ fontSize: '10px' }} />
                </AntdButton>
              </AntdDropdown>
              {index === 0 &&
                (isDeleting ? (
                  <AntdButton danger loading size="middle" />
                ) : (
                  <AntdButton
                    danger
                    icon={<DeleteOutlined />}
                    size="middle"
                    onClick={() => showDeleteConfirm(transaction, kisan._id, 'CREDIT')}
                  />
                ))}
            </div>
          );
        }
      },
    },
  ];

  const dataSource =
    kisan && kisan.transactions
      ? kisan.transactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((txn, idx) => ({ ...txn, key: idx }))
      : [];

  const customHeader = (
    <thead>
      <tr className="custom-header-row">
        <th colSpan={3}></th>
        <th colSpan={1} className="currency-header">
          <FormattedMessage id="currencyWithBracket" defaultMessage="(₹)" />
        </th>
        <th colSpan={5} className="entered-amounts-header">
          <FormattedMessage
            id="enteredAmountsInBill"
            defaultMessage="Entered Amounts In The Bill (₹)"
          />
        </th>
        <th colSpan={2} className="outstanding-header">
          <FormattedMessage
            id="totalOutstandingAfterBill"
            defaultMessage="Total Outstanding After Bill (₹)"
          />
        </th>
      </tr>
    </thead>
  );

  // Helper: Render transaction as card for mobile
  const renderTransactionCard = (txn, idx) => {
    // Determine status based on balance
    const status = txn.balanceAfterThisTransaction === 0 ? 'Clear' : 'Outstanding';

    return (
      <div className="kisan-transaction-card" key={txn._id || idx}>
        <div className="kisan-transaction-card-row serial-row">
          <span>
            <span className="kisan-transaction-card-label">#</span>
            {idx + 1}
          </span>
          <span
            className={`kisan-transaction-status-badge ${txn.balanceAfterThisTransaction === 0 ? '' : 'outstanding'}`}
          >
            {status}
          </span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="date" />
          </span>{' '}
          <span>{dateConverter(txn.date)}</span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="comment" />
          </span>
          <EllipsisText style={{ flex: 1 }} maxWidth="200px">
            {txn.comment || '-'}
          </EllipsisText>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="advanceDebited" />
          </span>{' '}
          <span>{txn.type === 'DEBIT' ? `₹${toFixed(txn.transactionAmount)}` : ''}</span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="grossTotalWithCurrency" />
          </span>{' '}
          <span>{`₹${toFixed(txn.grossTotal || 0)}`}</span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="billTotal" />
          </span>{' '}
          <span>{`₹${toFixed(txn.netTotal || 0)}`}</span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="advanceCredited" />
          </span>{' '}
          <span>
            {txn.type === 'CREDIT'
              ? `₹${toFixed(txn.advanceSettlement || 0)}`
              : txn.type === 'ADVANCESETTLEMENT'
                ? `₹${toFixed(txn.transactionAmount || 0)}`
                : ''}
          </span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="cashPaid" />
          </span>{' '}
          <span>
            {txn.paidToKisan > 0 ? (
              <span className="cash-paid-green">₹{toFixed(txn.paidToKisan)}</span>
            ) : (
              <span>₹{toFixed(txn.paidToKisan || 0)}</span>
            )}
          </span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="carryForwardFromThisBill" />
          </span>{' '}
          <span>
            {txn.type === 'CREDIT' && txn.netTotal > 0
              ? `₹${toFixed((txn.netTotal || 0) - (txn.advanceSettlement || 0) - (txn.paidToKisan || 0))}`
              : 0}
          </span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="carryForward" />
          </span>{' '}
          <span>{`₹${toFixed(txn.carryForwardFromThisEntry || 0)}`}</span>
        </div>
        <div className="kisan-transaction-card-row">
          <span className="kisan-transaction-card-label">
            <FormattedMessage id="balance" />
          </span>{' '}
          <span
            className={txn.balanceAfterThisTransaction < 0 ? 'text-danger' : 'text-primary'}
          >{`₹${toFixed(txn.balanceAfterThisTransaction || 0)}`}</span>
        </div>
        <AntdDivider style={{ margin: '12px 0 10px 0' }} />
        <div
          className="kisan-transaction-card-actions"
          style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}
        >
          {columns[columns.length - 1].render(null, txn, idx)}
        </div>
      </div>
    );
  };

  return (
    <div className="kisan-transactions-table-wrapper">
      {isLoading ? (
        <div className="kisan-transactions-table-shimmer">
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
        <>
          {isMobileOrTablet ? (
            <>
              {mobileTransactionView === 'table' ? (
                <div className="kisan-transactions-table-mobile">
                  <AntdTable
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    locale={{
                      emptyText: (
                        <FormattedMessage id="noRecordFound" defaultMessage="No record found" />
                      ),
                    }}
                    size="small"
                    components={{
                      header: {
                        wrapper: props => (
                          <>
                            {customHeader}
                            {props.children}
                          </>
                        ),
                      },
                    }}
                    scroll={{ x: 1200 }}
                  />
                </div>
              ) : dataSource.length === 0 ? (
                <div className="text-center text-primary">
                  <FormattedMessage id="noRecordFound" defaultMessage="No record found" />
                </div>
              ) : (
                <div className="kisan-transactions-table-mobile">
                  {dataSource.map((txn, idx) => renderTransactionCard(txn, idx))}
                </div>
              )}
            </>
          ) : (
            <div className="kisan-transactions-table-desktop">
              <AntdTable
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                locale={{
                  emptyText: (
                    <FormattedMessage id="noRecordFound" defaultMessage="No record found" />
                  ),
                }}
                size="small"
                components={{
                  header: {
                    wrapper: props => (
                      <>
                        {customHeader}
                        {props.children}
                      </>
                    ),
                  },
                }}
                scroll={{ x: 800 }}
              />
            </div>
          )}
        </>
      )}
      <div className="hide-till-print">
        <Kisanreceipt data={transaction} ref={componentRef} />
      </div>
      <div className="hide-till-print">
        <Kisancreditreceipt data={transaction} ref={creditPrintRef} />
      </div>
      <div className="hide-till-print">
        <KisanCreditReceiptThermal data={transaction} ref={creditThermalPrintRef} />
      </div>
    </div>
  );
};

export default Kisantransactionstable;
