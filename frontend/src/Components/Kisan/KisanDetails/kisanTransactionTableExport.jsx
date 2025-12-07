import React, { useRef } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './kisanDetailsClean.css';

const KisanTransactionTableExport = ({
  transactions = [],
  kisanName = '',
  kisanNameHindi = '',
  buttonText = 'Export Transactions',
}) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write('<html><head><title>Transactions');
    printWindow.document.write('</title>');
    printWindow.document.write(`
            <style>
                body { font-family: sans-serif; }
                .print-table { border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px #e0e0e0; background: #fff; width: 100%; border-collapse: collapse; }
                .print-table th { background: linear-gradient(90deg, #e53935 0%, #ffb300 100%); color: #fff; border: 1px solid #aaa; padding: 8px; font-size: 12px; }
                .print-table td { border: 1px solid #aaa; padding: 8px; font-size: 11px; }
                .print-table th:nth-child(3), .print-table td:nth-child(3) { max-width: 220px; width: 22%; min-width: 120px; word-break: break-word; }
                .print-row-even { background: #fff8f6; }
                .print-row-odd { background: #fbe9e7; }
                .print-company { font-weight: 700; font-size: 1.2em; margin-bottom: 0.5em; text-align: center; color: #e53935; letter-spacing: 1px; text-shadow: 0 1px 4px #f8bbd0; }
                .print-title { font-size: 1em; font-weight: 600; margin-bottom: 0.7em; text-align: center; color: #222; }
                .print-sub { color: #888; font-size: 0.95em; margin-bottom: 1.2em; text-align: center; }
            </style>
        `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <>
      <Button
        type="link"
        icon={<DownloadOutlined />}
        onClick={handlePrint}
        style={{
          color: '#1677ff',
          fontWeight: 600,
          fontSize: 14,
          padding: 0,
          height: 'auto',
        }}
      >
        {buttonText}
      </Button>
      <div ref={printRef} style={{ display: 'none' }}>
        <div className="print-company">Maharaj Vegetable Company</div>
        <div className="print-title">
          Transactions for{' '}
          {kisanNameHindi
            ? `${kisanNameHindi}${kisanName ? ` (${kisanName})` : ''}`
            : kisanName || 'Kisan'}
        </div>
        <div className="print-sub">
          Print Date: {new Date().toLocaleDateString('en-GB').replaceAll('/', '-')}
        </div>
        <table className="print-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Total Carry Forward</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions
              ?.slice()
              .reverse()
              .map((tran, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'print-row-even' : 'print-row-odd'}>
                  <td>
                    {tran.date
                      ? new Date(tran.date).toLocaleDateString('en-GB').replaceAll('/', '-')
                      : '-'}
                  </td>
                  <td>{tran.type || '-'}</td>
                  <td>
                    {tran.type === 'CREDIT'
                      ? [
                          tran.grossTotal != null
                            ? `Trading Total: ₹${tran.grossTotal.toLocaleString('en-GB')}`
                            : null,
                          tran.netTotal != null
                            ? `Bill Total: ₹${tran.netTotal.toLocaleString('en-GB')}`
                            : null,
                          tran.advanceSettlement != null
                            ? `Advance Recovered: ₹${tran.advanceSettlement.toLocaleString('en-GB')}`
                            : null,
                          tran.paidToKisan != null
                            ? `Cash Paid: ₹${tran.paidToKisan.toLocaleString('en-GB')}`
                            : null,
                          tran.carryForwardFromThisEntry != null
                            ? `Carry Forward: ₹${tran.carryForwardFromThisEntry.toLocaleString('en-GB')}`
                            : null,
                        ]
                          .filter(Boolean)
                          .map((line, i) => <div key={i}>{line}</div>)
                      : tran.transactionAmount != null
                        ? `₹${tran.transactionAmount?.toLocaleString('en-GB')}`
                        : '-'}
                  </td>
                  <td>
                    {tran.balanceAfterThisTransaction != null
                      ? `₹${tran.balanceAfterThisTransaction?.toLocaleString('en-GB')}`
                      : '-'}
                  </td>
                  <td>
                    {tran.carryForwardFromThisEntry != null
                      ? `₹${tran.carryForwardFromThisEntry.toLocaleString('en-GB')}`
                      : '-'}
                  </td>
                  <td>{tran.comment || '-'}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div
          style={{
            marginTop: '2.5em',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 500, fontSize: '1em', color: '#888' }}>Signatory</div>
            <div
              style={{
                borderBottom: '1.5px solid #888',
                width: '160px',
                height: '28px',
                marginTop: '0.7em',
                marginBottom: '0.2em',
              }}
            ></div>
            <div style={{ fontSize: '0.95em', color: '#b71c1c' }}>Maharaj Vegetable Company</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KisanTransactionTableExport;
