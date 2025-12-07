import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Spin,
  Typography,
  Space,
  Alert,
  message,
} from 'antd';
import {
  CalendarOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { SimpleShimmer } from '../Common';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  convertOnlyDate,
  getOnlyMonth,
  getTransactionsBydate,
  getTransactionsByMonth,
  getTransactionsBetweenDates,
  dateConverter,
} from '../../Utility/utility';
import Transactionperiodsummary from './transactionPeriodSummary';
import Transactiontable from './TransactionTable';

// Initialize dayjs plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

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

const Kisanreport = () => {
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
  const currentMonth = useMemo(() => dayjs().startOf('month'), []);

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
      const result = await getTransactionsBydate(dateString);
      setState(prev => ({
        ...prev,
        transactions: Array.isArray(result) ? result : [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching transactions by date:', error);
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
      const result = await getTransactionsByMonth(monthString);
      setState(prev => ({
        ...prev,
        transactions: Array.isArray(result) ? result : [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching transactions by month:', error);
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
      const result = await getTransactionsBetweenDates(startString, endString);
      setState(prev => ({
        ...prev,
        transactions: Array.isArray(result) ? result : [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching transactions by range:', error);
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

    // Calculate summary values
    let outGoingCash = 0,
      advanceSettled = 0,
      carryForwardAmount = 0;
    let advanceTaken = 0,
      cashPaidTokisan = 0,
      totalCommissionEarned = 0;

    state.transactions.forEach(transaction => {
      if (transaction.type === 'DEBIT') {
        outGoingCash += Math.abs(parseInt(transaction.transactionAmount || 0));
        advanceTaken += Math.abs(parseInt(transaction.transactionAmount || 0));
      }
      if (transaction.type === 'CREDIT') {
        outGoingCash += parseInt(transaction.paidToKisan || 0);
        cashPaidTokisan += parseInt(transaction.paidToKisan || 0);
        carryForwardAmount += parseInt(transaction.carryForwardAmount || 0);
        advanceSettled += parseInt(transaction.advanceSettlement || 0);
        totalCommissionEarned +=
          (transaction.grossTotal || 0) * ((transaction.commission || 0) / 100);
      }
      if (transaction.type === 'ADVANCESETTLEMENT') {
        outGoingCash += Math.abs(parseInt(transaction.transactionAmount || 0));
        advanceSettled += Math.abs(parseInt(transaction.transactionAmount || 0));
      }
    });

    return `
         <div class="summary">
            <div class="summary-title">Transaction Summary Report</div>
            <div class="summary-grid">
               <div class="summary-item">
                  <div class="summary-label">Total Outgoing Cash</div>
                  <div class="summary-value" style="font-size: 16px;">₹${outGoingCash.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Advance Taken</div>
                  <div class="summary-value" style="font-size: 16px;">₹${advanceTaken.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Advance Settled</div>
                  <div class="summary-value" style="font-size: 16px;">₹${advanceSettled.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Cash Paid</div>
                  <div class="summary-value" style="font-size: 16px;">₹${cashPaidTokisan.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Carry Forward</div>
                  <div class="summary-value" style="font-size: 16px;">₹${carryForwardAmount.toLocaleString()}</div>
               </div>
               <div class="summary-item">
                  <div class="summary-label">Commission Earned</div>
                  <div class="summary-value" style="font-size: 16px;">₹${Math.round(totalCommissionEarned).toLocaleString()}</div>
               </div>
            </div>
         </div>
      `;
  }, [state.transactions]);

  // Generate transactions table HTML
  const generateTransactionsHTML = useCallback(() => {
    if (!state.transactions || state.transactions.length === 0) return '';

    const sortedTransactions = [...state.transactions].sort((a, b) =>
      new Date(a.date) > new Date(b.date) ? -1 : 1
    );

    const tableRows = sortedTransactions
      .map(transaction => {
        const particulars =
          transaction.type === 'CREDIT'
            ? {
                bags: transaction.numberofBags || 0,
                weight: transaction.totalweight || 0,
                rate: transaction.rate || 0,
                commission: transaction.commission || 0,
                commissionAmount: (
                  (transaction.grossTotal || 0) *
                  ((transaction.commission || 0) / 100)
                ).toFixed(2),
              }
            : null;

        const particularsHTML = particulars
          ? `
            <div class="detail-line"><span class="detail-label">Bags:</span> ${particulars.bags}</div>
            <div class="detail-line"><span class="detail-label">Weight:</span> ${particulars.weight} kg</div>
            <div class="detail-line"><span class="detail-label">Rate:</span> ₹${particulars.rate}/kg</div>
            <div class="detail-line"><span class="detail-label">Commission:</span> ${particulars.commission}% (₹${particulars.commissionAmount})</div>
         `
          : '-';

        const summaryItems = [];
        if (transaction.type === 'DEBIT') {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Advance Taken:</span> ₹${transaction.transactionAmount || 0}</div>`
          );
        }
        if (transaction.netTotal) {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Bill Total:</span> ₹${transaction.netTotal}</div>`
          );
        } else {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Bill Total:</span> -</div>`
          );
        }

        // Always show Advance Paid field
        if (transaction.type === 'ADVANCESETTLEMENT') {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Advance Paid:</span> ₹${transaction.transactionAmount || 0}</div>`
          );
        } else if (transaction.advanceSettlement) {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Advance Paid:</span> ₹${transaction.advanceSettlement}</div>`
          );
        } else {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Advance Paid:</span> -</div>`
          );
        }

        if (transaction.paidToKisan) {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Cash Paid:</span> ₹${transaction.paidToKisan}</div>`
          );
        } else {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Cash Paid:</span> -</div>`
          );
        }

        // Always show Total Carry Forward field
        if (transaction.carryForwardFromThisEntry) {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Total Carry Forward:</span> ₹${transaction.carryForwardFromThisEntry}</div>`
          );
        } else if (transaction.carryForwardAmount) {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Total Carry Forward:</span> ₹${transaction.carryForwardAmount}</div>`
          );
        } else {
          summaryItems.push(
            `<div class="detail-line"><span class="detail-label">Total Carry Forward:</span> -</div>`
          );
        }

        const summaryHTML = summaryItems.length > 0 ? summaryItems.join('') : '-';

        return `
            <tr>
               <td class="name-cell">
                  <div class="name-bold">${transaction.name}</div>
                  <div class="date-gray">${new Date(transaction.date).toLocaleDateString()}</div>
               </td>
               <td class="particulars-cell">${particularsHTML}</td>
               <td class="summary-cell">${summaryHTML}</td>
            </tr>
         `;
      })
      .join('');

    return `
         <table class="transactions-table">
            <thead>
               <tr>
                  <th class="name-cell">Name & Date</th>
                  <th class="particulars-cell">Particulars</th>
                  <th class="summary-cell">Financial Summary</th>
               </tr>
            </thead>
            <tbody>
               ${tableRows}
            </tbody>
         </table>
      `;
  }, [state.transactions]);

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

      // Generate print HTML
      const printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
               <meta charset="utf-8">
               <title>Kisan Report - ${displayDate}</title>
               <style>
                  * {
                     margin: 0;
                     padding: 0;
                     box-sizing: border-box;
                  }
                  
                  body {
                     font-family: Arial, sans-serif;
                     font-size: 10pt;
                     line-height: 1.4;
                     color: #000;
                     background: white;
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
                  }
                  
                  .header p {
                     font-size: 11pt;
                     color: #666;
                  }
                  
                  .summary {
                     margin-bottom: 20px;
                     border: 1px solid #000;
                     padding: 10px;
                     background: #f9f9f9;
                  }
                  
                  .summary-title {
                     text-align: center;
                     font-weight: bold;
                     font-size: 12pt;
                     margin-bottom: 10px;
                  }
                  
                  .summary-grid {
                     display: grid;
                     grid-template-columns: repeat(3, 1fr);
                     gap: 8px;
                     margin-bottom: 10px;
                  }
                  
                  .summary-item {
                     border: 1px solid #000;
                     padding: 6px;
                     text-align: center;
                     background: white;
                  }
                  
                  .summary-label {
                     font-size: 8pt;
                     font-weight: bold;
                     margin-bottom: 2px;
                  }
                  
                  .summary-value {
                     font-size: 10pt;
                     font-weight: bold;
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
                     vertical-align: top;
                     font-size: 9pt;
                  }
                  
                  .transactions-table th {
                     background: #f0f0f0;
                     font-weight: bold;
                     text-align: center;
                  }
                  
                  .name-cell {
                     width: 25%;
                  }
                  
                  .particulars-cell {
                     width: 40%;
                  }
                  
                  .summary-cell {
                     width: 35%;
                  }
                  
                  .name-bold {
                     font-weight: bold;
                     font-size: 10pt;
                     margin-bottom: 2px;
                  }
                  
                  .date-gray {
                     font-size: 9pt;
                     color: #666;
                  }
                  
                  .detail-line {
                     margin-bottom: 1px;
                     font-size: 9pt;
                  }
                  
                  .detail-label {
                     font-weight: bold;
                  }
                  
                  @media print {
                     body { -webkit-print-color-adjust: exact; }
                     .page-break { page-break-before: always; }
                  }
               </style>
            </head>
            <body>
               <div class="header">
                  <h1>TRANSACTION REPORT</h1>
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
      let outGoingCash = 0,
        advanceSettled = 0,
        carryForwardAmount = 0;
      let advanceTaken = 0,
        cashPaidTokisan = 0,
        totalCommissionEarned = 0;

      state.transactions.forEach(transaction => {
        if (transaction.type === 'DEBIT') {
          outGoingCash += Math.abs(parseInt(transaction.transactionAmount || 0));
          advanceTaken += Math.abs(parseInt(transaction.transactionAmount || 0));
        }
        if (transaction.type === 'CREDIT') {
          outGoingCash += parseInt(transaction.paidToKisan || 0);
          cashPaidTokisan += parseInt(transaction.paidToKisan || 0);
          carryForwardAmount += parseInt(transaction.carryForwardAmount || 0);
          advanceSettled += parseInt(transaction.advanceSettlement || 0);
          totalCommissionEarned +=
            (transaction.grossTotal || 0) * ((transaction.commission || 0) / 100);
        }
      });

      // Prepare CSV content
      const summarySection = [
        ['KISAN TRANSACTION REPORT'],
        [`Report Period: ${displayDate}`],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        [''],
        ['SUMMARY'],
        ['Total Outgoing Cash', `₹${outGoingCash.toLocaleString()}`],
        ['Advance Taken', `₹${advanceTaken.toLocaleString()}`],
        ['Advance Settled', `₹${advanceSettled.toLocaleString()}`],
        ['Cash Paid', `₹${cashPaidTokisan.toLocaleString()}`],
        ['Carry Forward', `₹${carryForwardAmount.toLocaleString()}`],
        ['Commission Earned', `₹${Math.round(totalCommissionEarned).toLocaleString()}`],
        [''],
        ['TRANSACTION DETAILS'],
        [
          'Name',
          'Date',
          'Type',
          'Bags',
          'Weight (kg)',
          'Rate (₹/kg)',
          'Commission (%)',
          'Commission Amount (₹)',
          'Bill Total (₹)',
          'Advance Taken (₹)',
          'Advance Paid (₹)',
          'Cash Paid (₹)',
          'Carry Forward (₹)',
        ],
      ];

      // Sort transactions by date (newest first)
      const sortedTransactions = [...state.transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Prepare transaction rows
      const transactionRows = sortedTransactions.map(transaction => {
        const commissionAmount =
          transaction.type === 'CREDIT'
            ? ((transaction.grossTotal || 0) * ((transaction.commission || 0) / 100)).toFixed(2)
            : 0;

        return [
          transaction.name,
          new Date(transaction.date).toLocaleDateString(),
          transaction.type === 'CREDIT' ? 'Sale' : 'Advance',
          transaction.type === 'CREDIT' ? transaction.numberofBags || 0 : '-',
          transaction.type === 'CREDIT' ? transaction.totalweight || 0 : '-',
          transaction.type === 'CREDIT' ? transaction.rate || 0 : '-',
          transaction.type === 'CREDIT' ? transaction.commission || 0 : '-',
          transaction.type === 'CREDIT' ? commissionAmount : '-',
          transaction.netTotal || '-',
          transaction.type === 'DEBIT' ? transaction.transactionAmount || 0 : '-',
          transaction.type === 'ADVANCESETTLEMENT'
            ? transaction.transactionAmount || 0
            : transaction.advanceSettlement || '-',
          transaction.paidToKisan || '-',
          transaction.carryForwardFromThisEntry || transaction.carryForwardAmount || '-',
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
        `kisan_report_${displayDate.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
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
    document.title = 'VVMS - Kisan Report';
    // Don't fetch data automatically on mount
    setState(prev => ({ ...prev, isLoading: false }));
    setCanGenerate(true); // Ensure Generate Report is enabled on load
  }, []);

  const hasTransactions = state.transactions && state.transactions.length > 0;
  const hasSearched = state.transactions !== null; // Track if user has searched

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
              <Transactionperiodsummary
                transactionSummary={state.transactions}
                date={displayDate}
              />
              <Transactiontable
                transactionSummary={state.transactions}
                isPrint={false}
                printHandler={handlePrint}
                exportHandler={handleExportExcel}
              />
            </div>
          ) : (
            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <InfoCircleOutlined style={{ fontSize: 48, color: '#8c8c8c', marginBottom: 16 }} />
              <Title level={4} type="secondary">
                {filters.reportType === REPORT_TYPES.BY_DATE &&
                filters.selectedDate &&
                filters.selectedDate.isSame(today, 'day') ? (
                  <FormattedMessage
                    id="report.noTransactionsToday"
                    defaultMessage="No Transactions were done Today."
                  />
                ) : (
                  <FormattedMessage
                    id="report.noTransactionsDate"
                    defaultMessage="No Transactions were found for the selected criteria."
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
    </div>
  );
};

export default Kisanreport;
