import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, Row, Col, Select, DatePicker, Button, Spin, Typography, Space, Alert } from 'antd';
import { messageCompat as message } from '../../Utility/notificationHelper';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { SimpleShimmer } from '../Common';
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

const KisanReportLegacy = () => {
  // Refs
  const componentRef = useRef();

  // State
  const [state, setState] = useState({
    transactions: null,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState({
    reportType: REPORT_TYPES.BY_DATE,
    selectedDate: dayjs(),
    selectedMonth: dayjs(),
    dateRange: [dayjs(), dayjs()],
    isRangeInit: true,
  });

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

  // API call handlers with automatic fetch on change
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

  // Event handlers - with automatic data fetching (legacy behavior)
  const handleReportTypeChange = useCallback(reportType => {
    setFilters(prev => ({ ...prev, reportType }));
  }, []);

  const handleDateChange = useCallback(
    date => {
      if (!date) return;
      setFilters(prev => ({ ...prev, selectedDate: date }));
      // Auto-fetch in legacy mode
      fetchTransactionsByDate(date);
    },
    [fetchTransactionsByDate]
  );

  const handleMonthChange = useCallback(
    month => {
      if (!month) return;
      setFilters(prev => ({ ...prev, selectedMonth: month }));
      // Auto-fetch in legacy mode
      fetchTransactionsByMonth(month);
    },
    [fetchTransactionsByMonth]
  );

  const handleRangeChange = useCallback(
    dates => {
      if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) return;

      const [startDate, endDate] = dates;
      setFilters(prev => ({
        ...prev,
        dateRange: [startDate, endDate],
        isRangeInit: false,
      }));
      // Auto-fetch in legacy mode
      fetchTransactionsByRange(startDate, endDate);
    },
    [fetchTransactionsByRange]
  );

  // Initialize data on component mount (legacy behavior)
  useEffect(() => {
    document.title = 'VVMS - Kisan Report (Legacy)';
    fetchTransactionsByDate(filters.selectedDate);
  }, []);

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

  const hasTransactions = state.transactions && state.transactions.length > 0;

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: 4,
        }}
      >
        <Text style={{ color: '#856404' }}>
          🚨 <strong>Legacy Mode:</strong> This is the original report view for comparison purposes.
        </Text>
      </div>

      {/* Simple Filter Section - Legacy Style */}
      <Card title="Report Filters" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <label>Report Type:</label>
            <Select
              value={filters.reportType}
              onChange={handleReportTypeChange}
              style={{ width: '100%' }}
            >
              <Option value={REPORT_TYPES.BY_DATE}>By Day</Option>
              <Option value={REPORT_TYPES.BY_MONTH}>Monthly</Option>
              <Option value={REPORT_TYPES.BETWEEN_DATES}>Between Dates</Option>
            </Select>
          </Col>

          {filters.reportType === REPORT_TYPES.BY_DATE && (
            <Col span={6}>
              <label>Select Date:</label>
              <DatePicker
                value={filters.selectedDate}
                onChange={handleDateChange}
                style={{ width: '100%' }}
                disabledDate={isDateDisabled}
                format={DATE_FORMAT}
              />
            </Col>
          )}

          {filters.reportType === REPORT_TYPES.BY_MONTH && (
            <Col span={6}>
              <label>Select Month:</label>
              <DatePicker
                value={filters.selectedMonth}
                onChange={handleMonthChange}
                style={{ width: '100%' }}
                picker="month"
                disabledDate={isMonthDisabled}
                format={MONTH_FORMAT}
              />
            </Col>
          )}

          {filters.reportType === REPORT_TYPES.BETWEEN_DATES && (
            <Col span={12}>
              <label>Select Date Range:</label>
              <RangePicker
                value={filters.dateRange}
                onChange={handleRangeChange}
                style={{ width: '100%' }}
                disabledDate={isDateDisabled}
                format={DATE_FORMAT}
              />
            </Col>
          )}
        </Row>
      </Card>

      {/* Loading State */}
      {state.isLoading && <SimpleShimmer />}

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

      {/* Simple Results Display */}
      {!state.isLoading && hasTransactions && (
        <Card title={`Report for ${displayDate}`} style={{ marginBottom: 16 }}>
          <Text>
            <strong>Total Transactions:</strong> {state.transactions.length}
          </Text>
          <div style={{ marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{ border: '1px solid #d9d9d9', padding: 8 }}>Name</th>
                  <th style={{ border: '1px solid #d9d9d9', padding: 8 }}>Date</th>
                  <th style={{ border: '1px solid #d9d9d9', padding: 8 }}>Type</th>
                  <th style={{ border: '1px solid #d9d9d9', padding: 8 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {state.transactions.slice(0, 10).map((transaction, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #d9d9d9', padding: 8 }}>{transaction.name}</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: 8 }}>
                      {dateConverter(transaction.date)}
                    </td>
                    <td style={{ border: '1px solid #d9d9d9', padding: 8 }}>{transaction.type}</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: 8 }}>
                      ₹{transaction.transactionAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {state.transactions.length > 10 && (
              <Text style={{ marginTop: 8, display: 'block' }}>
                ... and {state.transactions.length - 10} more transactions
              </Text>
            )}
          </div>
        </Card>
      )}

      {!state.isLoading && !hasTransactions && state.transactions !== null && (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <InfoCircleOutlined style={{ fontSize: 48, color: '#8c8c8c', marginBottom: 16 }} />
          <Title level={4} type="secondary">
            No Transactions Found
          </Title>
          <Text type="secondary">No transactions were found for the selected criteria.</Text>
        </Card>
      )}
    </div>
  );
};

export default KisanReportLegacy;
