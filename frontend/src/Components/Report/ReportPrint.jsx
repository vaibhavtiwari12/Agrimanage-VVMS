import React from 'react';
import Transactionperiodsummary from './transactionPeriodSummary';
import Transactiontable from './TransactionTable';

const Reportprint = React.forwardRef((props, ref) => {
  console.log(props.transactionSummary, props.searchDate);
  return (
    <div
      ref={ref}
      style={{
        padding: '20mm',
        backgroundColor: '#fff',
        width: '210mm', // A4 width
        margin: '0 auto',
        fontSize: '12pt',
        lineHeight: '1.4',
        color: '#000',
        '@media print': {
          padding: '15mm',
          margin: 0,
          fontSize: '10pt',
          backgroundColor: '#fff !important',
          '-webkit-print-color-adjust': 'exact',
          'color-adjust': 'exact',
        },
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
            .ant-table {
              page-break-inside: auto !important;
              break-inside: auto !important;
            }
            .ant-table-thead > tr > th,
            .ant-table-tbody > tr > td {
              padding: 8px !important;
              border: 1px solid #000 !important;
              font-size: 10pt !important;
              line-height: 1.2 !important;
              page-break-inside: avoid !important;
            }
            .ant-table-tbody > tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .ant-table {
              border-collapse: collapse !important;
              width: 100% !important;
            }
            .ant-table-container {
              border: 1px solid #000 !important;
            }
            .ant-card {
              border: none !important;
              box-shadow: none !important;
              page-break-inside: avoid !important;
            }
            .ant-statistic-title {
              font-size: 10pt !important;
              color: #000 !important;
            }
            .ant-statistic-content {
              font-size: 12pt !important;
              color: #000 !important;
            }
            .no-print {
              display: none !important;
            }
            .print-section {
              page-break-before: auto !important;
              page-break-after: auto !important;
            }
          }
        `}
      </style>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1
          style={{
            fontSize: '18pt',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            color: '#000',
          }}
        >
          TRANSACTION REPORT
        </h1>
        <p
          style={{
            fontSize: '12pt',
            margin: 0,
            color: '#666',
          }}
        >
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <Transactionperiodsummary
        transactionSummary={props.transactionSummary}
        date={props.date}
        isPrint={true}
      />

      <div style={{ marginTop: '20px' }}>
        <Transactiontable isPrint={true} transactionSummary={props.transactionSummary} />
      </div>
    </div>
  );
});

export default Reportprint;
