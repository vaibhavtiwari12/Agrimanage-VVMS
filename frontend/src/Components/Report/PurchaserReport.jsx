import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  Col,
  Row,
  Select,
  DatePicker,
  Button,
  Spin,
  Typography,
  Space,
  Alert,
  message,
} from 'antd';
import { CalendarOutlined, InfoCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { SimpleShimmer } from '../Common';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  convertOnlyDate,
  getOnlyMonth,
  getPurchaserTransactionsBydate,
  getPurchaserTransactionsByMonth,
  getPurchaserTransactionsBetweenDates,
  dateConverter,
} from '../../Utility/utility';
import PurchaserReportPrint from './PurchaserReportPrint';
import PurchaserReportTxnTable from './PurchaserReportTxnTable';
import PurchaserSummary from './PurchaserSummary';

// Configure dayjs plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Constants
const REPORT_TYPES = {
  BY_DATE: 'bydate',
  BY_MONTH: 'bymonth',
  BETWEEN_DATES: 'betweenDates',
};

const DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_FORMAT = 'YYYY-MM';

const PurchaserReport = () => {
  // Refs
  const componentRef = useRef();
  const history = useHistory();

  // State
  const [state, setState] = useState({
    transactions: null,
    isLoading: true,
    error: null,
  });

  const [filters, setFilters] = useState({
    reportType: REPORT_TYPES.BY_DATE,
    selectedDate: dayjs(),
    selectedMonth: dayjs(),
    dateRange: [dayjs(), dayjs()],
    isRangeInit: true,
  });

  const [canGenerate, setCanGenerate] = useState(true); // Track if we can generate report

  // Memoized values
  const today = useMemo(() => dayjs(), []);

  // Date validation functions
  const isDateDisabled = useCallback(
    current => {
      return current && current.isAfter(today, 'day');
    },
    [today]
  );

  const isMonthDisabled = useCallback(
    current => {
      return current && current.isAfter(today, 'month');
    },
    [today]
  );

  // API call handlers with proper error handling
  const fetchTransactionsByDate = useCallback(async date => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const dateString = date.format(DATE_FORMAT);
      const result = await getPurchaserTransactionsBydate(dateString);
      setState(prev => ({
        ...prev,
        transactions: Array.isArray(result) ? result : [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching purchaser transactions by date:', error);
      setState(prev => ({
        ...prev,
        transactions: [],
        isLoading: false,
        error: 'Failed to fetch transactions',
      }));
      message.error('Failed to fetch transactions');
    }
  }, []);

  const fetchTransactionsByMonth = useCallback(async month => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const monthString = month.format(MONTH_FORMAT);
      const result = await getPurchaserTransactionsByMonth(monthString);
      setState(prev => ({
        ...prev,
        transactions: Array.isArray(result) ? result : [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching purchaser transactions by month:', error);
      setState(prev => ({
        ...prev,
        transactions: [],
        isLoading: false,
        error: 'Failed to fetch transactions',
      }));
      message.error('Failed to fetch transactions');
    }
  }, []);

  const fetchTransactionsByRange = useCallback(async (startDate, endDate) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const startString = startDate.format(DATE_FORMAT);
      const endString = endDate.add(1, 'day').format(DATE_FORMAT);
      const result = await getPurchaserTransactionsBetweenDates(startString, endString);
      setState(prev => ({
        ...prev,
        transactions: Array.isArray(result) ? result : [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching purchaser transactions by range:', error);
      setState(prev => ({
        ...prev,
        transactions: [],
        isLoading: false,
        error: 'Failed to fetch transactions',
      }));
      message.error('Failed to fetch transactions');
    }
  }, []);

  // Event handlers
  const handleReportTypeChange = useCallback(reportType => {
    setFilters(prev => ({ ...prev, reportType }));
    setCanGenerate(true);
  }, []);

  const handleDateChange = useCallback(date => {
    if (!date) return;
    setFilters(prev => ({ ...prev, selectedDate: date }));
    setCanGenerate(true);
  }, []);

  const handleMonthChange = useCallback(month => {
    if (!month) return;
    setFilters(prev => ({ ...prev, selectedMonth: month }));
    setCanGenerate(true);
  }, []);

  const handleRangeChange = useCallback(dates => {
    if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) return;

    const [startDate, endDate] = dates;
    setFilters(prev => ({
      ...prev,
      dateRange: [startDate, endDate],
      isRangeInit: false,
    }));
    setCanGenerate(true);
  }, []);

  // Generate report handler
  const handleGenerateReport = useCallback(async () => {
    switch (filters.reportType) {
      case REPORT_TYPES.BY_DATE:
        await fetchTransactionsByDate(filters.selectedDate);
        break;
      case REPORT_TYPES.BY_MONTH:
        await fetchTransactionsByMonth(filters.selectedMonth);
        break;
      case REPORT_TYPES.BETWEEN_DATES:
        await fetchTransactionsByRange(filters.dateRange[0], filters.dateRange[1]);
        break;
      default:
        break;
    }
    setCanGenerate(false);
  }, [filters, fetchTransactionsByDate, fetchTransactionsByMonth, fetchTransactionsByRange]);

  // Memoized display values
  const displayDate = useMemo(() => {
    switch (filters.reportType) {
      case REPORT_TYPES.BY_DATE:
        return dateConverter(filters.selectedDate.format(DATE_FORMAT));
      case REPORT_TYPES.BY_MONTH:
        return filters.selectedMonth.format('MMMM YYYY');
      case REPORT_TYPES.BETWEEN_DATES:
        return `${dateConverter(filters.dateRange[0].format(DATE_FORMAT))} to ${dateConverter(filters.dateRange[1].format(DATE_FORMAT))}`;
      default:
        return '';
    }
  }, [filters]);

  // Generate summary HTML
  const generateSummaryHTML = useCallback(() => {
    if (!state.transactions || state.transactions.length === 0) return '';

    // Calculate summary values for the 3 required cards
    let totalOutstandingInPeriod = 0;
    let totalBuyingAmount = 0;
    let totalOutstandingSettled = 0;

    state.transactions.forEach(transaction => {
      if (transaction.type === 'DEBIT') {
        totalBuyingAmount += Math.abs(parseInt(transaction.transactionAmount || 0));
        totalOutstandingInPeriod += parseInt(transaction.transactionAmount || 0);
      }
      if (transaction.type === 'CREDIT') {
        totalOutstandingSettled += Math.abs(parseInt(transaction.transactionAmount || 0));
      }
    });

    return `
         <div class="summary">
            <div class="summary-title">Transaction Summary Report</div>
            <div class="summary-grid">
               <div class="summary-item">
                  <div class="summary-label">Total Outstanding In Period</div>
                  <div class="summary-value">₹${totalOutstandingInPeriod.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Total Buying Amount</div>
                  <div class="summary-value">₹${totalBuyingAmount.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Total Outstanding Settled in the Period</div>
                  <div class="summary-value">₹${totalOutstandingSettled.toLocaleString()}</div>
               </div>
            </div>
         </div>
      `;
  }, [state.transactions]);

  // Generate transactions table HTML
  const generateTransactionsHTML = useCallback(() => {
    if (!state.transactions || state.transactions.length === 0) return '';

    const sortedTransactions = [...state.transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const tableRows = sortedTransactions
      .map(transaction => {
        const transactionDate = new Date(transaction.date).toLocaleDateString();
        const purchaserName = transaction.name || 'N/A';
        const companyName = transaction.companyName || '';
        const boughtFrom = transaction.kisanName || '-';

        let particularsContent = '';
        let outstandingSettled = '-';
        let purchaseAmount = '-';

        if (transaction.type === 'CREDIT') {
          particularsContent = 'Advance Payment';
          outstandingSettled = `₹${Math.abs(parseInt(transaction.transactionAmount || 0)).toLocaleString()}`;
        } else if (transaction.type === 'DEBIT') {
          // Build particulars with bag, weight, rate
          const bags = parseInt(transaction.numberofBags || 0);
          const weight = parseFloat(transaction.totalweight || 0);
          const rate = parseFloat(transaction.rate || 0);

          particularsContent = `${bags} bags, ${weight.toFixed(2)} kg @ ₹${rate}/kg`;

          // Purchase amount is the transaction amount for DEBIT
          purchaseAmount = `₹${Math.abs(parseInt(transaction.transactionAmount || 0)).toLocaleString()}`;
        }

        return `
            <tr>
               <td class="name-cell">
                  <div class="transaction-name">${purchaserName}</div>
                  ${companyName ? `<div class="transaction-company">${companyName}</div>` : ''}
                  <div class="transaction-date">${transactionDate}</div>
               </td>
               <td class="bought-from-cell">${boughtFrom}</td>
               <td class="particulars-cell">${particularsContent}</td>
               <td class="outstanding-cell">${outstandingSettled}</td>
               <td class="purchase-cell">${purchaseAmount}</td>
            </tr>
         `;
      })
      .join('');

    return `
         <table class="transactions-table">
            <thead>
               <tr>
                  <th class="name-cell">Name & Date</th>
                  <th class="bought-from-cell">Bought From</th>
                  <th class="particulars-cell">Particulars</th>
                  <th class="outstanding-cell">Outstanding Settled</th>
                  <th class="purchase-cell">Purchase Amount</th>
               </tr>
            </thead>
            <tbody>
               ${tableRows}
            </tbody>
         </table>
      `;
  }, [state.transactions]);

  // Click handlers for purchaser and kisan names
  const handlePurchaserClick = useCallback(
    (purchaserName, purchaserId) => {
      console.log('Purchaser clicked:', { name: purchaserName, id: purchaserId });

      if (purchaserId) {
        // Navigate to purchaser details page
        history.push(`/purchaserDetails/${purchaserId}`);
        message.info(`Navigating to ${purchaserName}'s details`);
      } else {
        // Fallback if no ID available
        message.warning('Purchaser ID not available for navigation');
      }
    },
    [history]
  );

  const handleKisanClick = useCallback(
    (kisanName, kisanId) => {
      console.log('Kisan clicked:', { name: kisanName, id: kisanId });

      if (kisanId) {
        // Navigate to kisan details page
        history.push(`/kisanDetails/${kisanId}`);
        message.info(`Navigating to ${kisanName}'s details`);
      } else {
        // Fallback if no ID available
        message.warning('Kisan ID not available for navigation');
      }
    },
    [history]
  );

  // Custom print handler
  const handlePrint = useCallback(() => {
    if (!state.transactions || state.transactions.length === 0) {
      message.warning('No data to print');
      return;
    }

    try {
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
               <title>Purchaser Report</title>
               <style>
                  * {
                     box-sizing: border-box;
                     margin: 0;
                     padding: 0;
                  }
                  
                  body {
                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                     font-size: 11px;
                     line-height: 1.4;
                     color: #000;
                     background: white;
                     width: 210mm;
                     margin: 0 auto;
                     padding: 10mm;
                  }
                  
                  .header {
                     text-align: center;
                     margin-bottom: 20px;
                     border-bottom: 2px solid #000;
                     padding-bottom: 10px;
                  }
                  
                  .header h1 {
                     font-size: 18px;
                     font-weight: bold;
                     margin-bottom: 5px;
                  }
                  
                  .header p {
                     font-size: 12px;
                     color: #666;
                  }
                  
                  .summary {
                     margin-bottom: 20px;
                     border: 1px solid #ddd;
                     border-radius: 4px;
                     overflow: hidden;
                  }
                  
                  .summary-title {
                     background: #f5f5f5;
                     padding: 8px 12px;
                     font-weight: bold;
                     font-size: 12px;
                     border-bottom: 1px solid #ddd;
                  }
                  
                  .summary-grid {
                     display: grid;
                     grid-template-columns: repeat(3, 1fr);
                     gap: 0;
                  }
                  
                  .summary-item {
                     padding: 8px 12px;
                     border-right: 1px solid #eee;
                     border-bottom: 1px solid #eee;
                  }
                  
                  .summary-item:nth-child(3n) {
                     border-right: none;
                  }
                  
                  .summary-label {
                     font-size: 10px;
                     color: #666;
                     margin-bottom: 2px;
                  }
                  
                  .summary-value {
                     font-size: 11px;
                     font-weight: bold;
                     color: #000;
                  }
                  
                  .transactions-table {
                     width: 100%;
                     border-collapse: collapse;
                     margin-top: 10px;
                  }
                  
                  .transactions-table th,
                  .transactions-table td {
                     border: 1px solid #ddd;
                     padding: 6px 8px;
                     text-align: left;
                     vertical-align: top;
                  }
                  
                  .transactions-table th {
                     background: #f5f5f5;
                     font-weight: bold;
                     font-size: 10px;
                  }
                  
                  .transactions-table td {
                     font-size: 9px;
                  }
                  
                  .name-cell { width: 20%; }
                  .bought-from-cell { width: 15%; }
                  .particulars-cell { width: 35%; }
                  .outstanding-cell { width: 15%; text-align: right; }
                  .purchase-cell { width: 15%; text-align: right; }
                  
                  .transaction-name {
                     font-weight: bold;
                     margin-bottom: 2px;
                  }
                  
                  .transaction-company {
                     font-size: 8px;
                     color: #666;
                     margin-bottom: 2px;
                  }
                  
                  .transaction-date {
                     font-size: 8px;
                     color: #666;
                  }
                  
                  @media print {
                     body { -webkit-print-color-adjust: exact; }
                     .page-break { page-break-before: always; }
                  }
               </style>
            </head>
            <body>
               <div class="header">
                  <h1>PURCHASER TRANSACTION REPORT</h1>
                  <p>Generated on ${new Date().toLocaleDateString()} - Period: ${displayDate}</p>
               </div>
               
               ${generateSummaryHTML()}
               ${generateTransactionsHTML()}
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
            message.success('Report printed successfully');
          }, 1000);
        }, 500);
      };
    } catch (error) {
      console.error('Print error:', error);
      message.error('Failed to print report');
    }
  }, [state.transactions, displayDate, generateSummaryHTML, generateTransactionsHTML]);

  // Excel export handler
  const handleExportExcel = useCallback(() => {
    if (!state.transactions || state.transactions.length === 0) {
      message.warning('No data to export');
      return;
    }

    try {
      // Calculate summary values
      let totalBuyingAmount = 0,
        totalOutstandingSettled = 0,
        totalTransactions = 0;

      state.transactions.forEach(transaction => {
        totalTransactions++;
        if (transaction.type === 'DEBIT') {
          totalBuyingAmount += parseInt(transaction.transactionAmount || 0);
        }
        if (transaction.type === 'CREDIT') {
          totalOutstandingSettled += parseInt(transaction.transactionAmount || 0);
        }
      });

      // Prepare CSV content
      const summarySection = [
        ['PURCHASER TRANSACTION REPORT'],
        [`Report Period: ${displayDate}`],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        [''],
        ['SUMMARY'],
        ['Total Buying Amount', `₹${totalBuyingAmount.toLocaleString()}`],
        ['Total Outstanding Settled', `₹${totalOutstandingSettled.toLocaleString()}`],
        ['Total Transactions', totalTransactions],
        [''],
        ['TRANSACTION DETAILS'],
        [
          'Name',
          'Company',
          'Date',
          'Type',
          'Purchase Amount (₹)',
          'Outstanding Settled (₹)',
          'Bought From',
          'Bags',
          'Weight (kg)',
          'Rate (₹/kg)',
        ],
      ];

      // Sort transactions by date (newest first)
      const sortedTransactions = [...state.transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Prepare transaction rows
      const transactionRows = sortedTransactions.map(transaction => {
        return [
          transaction.name,
          transaction.companyName || '-',
          new Date(transaction.date).toLocaleDateString(),
          transaction.type === 'DEBIT' ? 'Purchase' : 'Payment',
          transaction.type === 'DEBIT' ? transaction.transactionAmount || 0 : '-',
          transaction.type === 'CREDIT' ? transaction.transactionAmount || 0 : '-',
          transaction.type === 'DEBIT' ? transaction.kisanName || '-' : '-',
          transaction.type === 'DEBIT' ? transaction.numberofBags || 0 : '-',
          transaction.type === 'DEBIT' ? transaction.totalweight || 0 : '-',
          transaction.type === 'DEBIT' ? transaction.rate || 0 : '-',
        ];
      });

      // Combine all rows
      const allRows = [...summarySection, ...transactionRows];

      // Convert to CSV format
      const csvContent = allRows
        .map(row => row.map(cell => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `purchaser_report_${displayDate.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export report');
    }
  }, [state.transactions, displayDate]);

  // Global export event listener
  useEffect(() => {
    const handleExportEvent = () => {
      handleExportExcel();
    };

    window.addEventListener('exportReport', handleExportEvent);
    return () => {
      window.removeEventListener('exportReport', handleExportEvent);
    };
  }, [handleExportExcel]);

  // Initialize data on component mount
  useEffect(() => {
    document.title = 'VVMS - Purchaser Report';
    fetchTransactionsByDate(today);
  }, [fetchTransactionsByDate, today]);

  const hasTransactions = state.transactions && state.transactions.length > 0;
  const isToday = filters.selectedDate.isSame(today, 'day');

  return (
    <div style={{ padding: '16px 0 0 0' }}>
      {/* Filter Section */}
      <Card style={{ marginBottom: 16, borderRadius: 12 }} bodyStyle={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 20, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0, color: '#000', fontWeight: 700 }}>
              <FormattedMessage id="report.selectFilter" defaultMessage="Select Filter" />
            </Title>
          </div>
        </div>

        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={7} lg={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              <FormattedMessage id="report.reportType" defaultMessage="Report Type:" />
            </div>
            <Select
              allowClear={false}
              showSearch={false}
              placeholder="-- Select Report Type --"
              value={filters.reportType || undefined}
              onChange={handleReportTypeChange}
              style={{ width: '100%' }}
            >
              <Option value={REPORT_TYPES.BY_DATE}>
                <FormattedMessage id="report.byDay" defaultMessage="By Day" />
              </Option>
              <Option value={REPORT_TYPES.BY_MONTH}>
                <FormattedMessage id="report.monthly" defaultMessage="Monthly" />
              </Option>
              <Option value={REPORT_TYPES.BETWEEN_DATES}>
                <FormattedMessage id="report.betweenDates" defaultMessage="Between Dates" />
              </Option>
            </Select>
          </Col>

          {/* Date Selection Controls - Only show when a filter is selected */}
          {filters.reportType && (
            <>
              {filters.reportType === REPORT_TYPES.BY_DATE && (
                <Col xs={24} sm={8} md={7} lg={6}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>
                    <FormattedMessage id="report.selectDate" defaultMessage="Select Date:" />
                  </div>
                  <DatePicker
                    value={filters.selectedDate}
                    onChange={handleDateChange}
                    style={{ width: '100%' }}
                    disabledDate={isDateDisabled}
                    placeholder="Select Date"
                    suffixIcon={<CalendarOutlined />}
                    format={DATE_FORMAT}
                    allowClear={false}
                    showToday
                  />
                </Col>
              )}

              {filters.reportType === REPORT_TYPES.BY_MONTH && (
                <Col xs={24} sm={8} md={7} lg={6}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>
                    <FormattedMessage id="report.selectMonth" defaultMessage="Select Month:" />
                  </div>
                  <DatePicker
                    value={filters.selectedMonth}
                    onChange={handleMonthChange}
                    style={{ width: '100%' }}
                    picker="month"
                    disabledDate={isMonthDisabled}
                    placeholder="Select Month"
                    suffixIcon={<CalendarOutlined />}
                    format={MONTH_FORMAT}
                    allowClear={false}
                    showToday={false}
                  />
                </Col>
              )}

              {filters.reportType === REPORT_TYPES.BETWEEN_DATES && (
                <Col xs={24} sm={16} md={10} lg={8}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>
                    <FormattedMessage
                      id="report.selectDateRange"
                      defaultMessage="Select Date Range:"
                    />
                  </div>
                  <RangePicker
                    value={filters.dateRange}
                    onChange={handleRangeChange}
                    style={{ width: '100%' }}
                    disabledDate={isDateDisabled}
                    placeholder={['Start Date', 'End Date']}
                    format={DATE_FORMAT}
                    allowClear={false}
                    showTime={false}
                  />
                  {!filters.isRangeInit &&
                    filters.dateRange[1].isBefore(filters.dateRange[0], 'day') && (
                      <Alert
                        message={
                          <FormattedMessage
                            id="report.dateRangeError"
                            defaultMessage="End Date cannot be earlier than Start Date"
                          />
                        }
                        type="error"
                        style={{ marginTop: 8 }}
                        showIcon
                        size="small"
                      />
                    )}
                </Col>
              )}

              {/* Generate Report Button - Below input fields */}
              <Col xs={24} sm={24} md={24} lg={24}>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    onClick={handleGenerateReport}
                    loading={state.isLoading}
                    style={{
                      height: '40px',
                      fontSize: '14px',
                      fontWeight: 400,
                      borderRadius: 6,
                      paddingLeft: 24,
                      paddingRight: 24,
                      minWidth: '160px',
                    }}
                    disabled={!canGenerate && !state.isLoading}
                  >
                    <FormattedMessage id="report.generateReport" defaultMessage="Generate Report" />
                  </Button>
                </div>
              </Col>
            </>
          )}
        </Row>
      </Card>

      {/* Error Display */}
      {state.error && (
        <Alert
          message="Error"
          description={state.error}
          type="error"
          style={{ marginBottom: 16 }}
          showIcon
          closable
          onClose={() => setState(prev => ({ ...prev, error: null }))}
        />
      )}

      {/* Loading State */}
      {state.isLoading && <SimpleShimmer />}

      {/* Results Section */}
      {!state.isLoading && (
        <>
          {hasTransactions ? (
            <div>
              {/* Summary and Table */}
              <PurchaserSummary transactionSummary={state.transactions} date={displayDate} />
              <PurchaserReportTxnTable
                transactionSummary={state.transactions}
                isPrint={false}
                printHandler={handlePrint}
                exportHandler={handleExportExcel}
                onPurchaserClick={handlePurchaserClick}
                onKisanClick={handleKisanClick}
              />
            </div>
          ) : (
            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <InfoCircleOutlined style={{ fontSize: 48, color: '#8c8c8c', marginBottom: 16 }} />
              <Title level={4} type="secondary">
                {isToday ? (
                  <FormattedMessage
                    id="report.noTransactionsToday"
                    defaultMessage="No Transactions were done Today."
                  />
                ) : (
                  <FormattedMessage
                    id="report.noTransactionsDate"
                    defaultMessage="No Transactions were done on this Date."
                  />
                )}
              </Title>
              <Text type="secondary">
                <FormattedMessage
                  id="report.tryDifferentDate"
                  defaultMessage="Please try a different date to see the transactions"
                />
              </Text>
            </Card>
          )}
        </>
      )}

      {/* Hidden Print Component */}
      <div className="hide-till-print">
        <PurchaserReportPrint
          transactionSummary={state.transactions}
          date={displayDate}
          ref={componentRef}
        />
      </div>
    </div>
  );
};

export default PurchaserReport;
