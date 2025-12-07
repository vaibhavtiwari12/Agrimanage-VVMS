import axios from 'axios';

// Simple retry wrapper for API calls
const withRetry = async (apiCall, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn(`API call failed (attempt ${attempt}/${maxRetries}):`, error.message);

      // Check if it's a server error that might be retryable
      const isRetryable =
        error.response?.status >= 500 ||
        error.code === 'NETWORK_ERROR' ||
        error.message.includes('temporarily unavailable');

      if (isRetryable && attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        continue;
      }

      throw error;
    }
  }
};

export const getAllKisan = async () => {
  return withRetry(async () => {
    const res = await fetch('/kisan/get');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allKisan = await res.json();
    return allKisan;
  });
};

export const getKisanByID = async id => {
  return withRetry(async () => {
    const res = await fetch(`/kisan/getByID/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allKisan = await res.json();
    console.log('Result of getkisanById');
    return allKisan;
  });
};

export const setYearChange = async changedYear => {
  return withRetry(async () => {
    await axios.post('/yearChange', {
      year: parseInt(changedYear),
    });
  });
};

export const dateConverter = date => {
  const D = new Date(date);
  const formattedDate = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear()} ${D.toLocaleString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }
  )}`;
  return formattedDate;
};

export const convertOnlyDate = date => {
  const D = new Date(date);
  const formattedDate = `${D.getFullYear()}-${('0' + (D.getMonth() + 1)).slice(
    -2
  )}-${('0' + D.getDate()).slice(-2)}`;
  return formattedDate;
};
export const getOnlyMonth = date => {
  const D = new Date(date);
  const formattedDate = `${D.getFullYear()}-${('0' + (D.getMonth() + 1)).slice(-2)}`;
  return formattedDate;
};

export const getTransactionsBydate = async date => {
  return withRetry(async () => {
    const res = await fetch(`kisan/getTodaysTransaction/${date}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allTransactions = await res.json();
    console.log('ALL TRANSACTION', allTransactions);
    return allTransactions;
  });
};
export const getTransactionsByMonth = async month => {
  return withRetry(async () => {
    const res = await fetch(`kisan/getTransactionByMonth/${month}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allTransactions = await res.json();
    console.log('ALL TRANSACTION -- Month', allTransactions);
    return allTransactions;
  });
};
export const getTransactionsBetweenDates = async (startDate, endDate) => {
  return withRetry(async () => {
    const res = await fetch(`kisan/getTransactionsBetweenDates/${startDate}/${endDate}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allTransactions = await res.json();
    console.log('ALL TRANSACTION -- Month', allTransactions);
    return allTransactions;
  });
};

/* PUrchaser Module */
export const getAllPurchasers = async () => {
  return withRetry(async () => {
    const purchasers = await axios.get('/purchaser/get');
    return purchasers;
  });
};

export const getPurchaserById = async id => {
  return withRetry(async () => {
    const allPurchaser = await axios.get(`/purchaser/getByID/${id}`);
    return allPurchaser.data;
  });
};

export const fetchCustomTransactionsForPurchaser = async id => {
  return withRetry(async () => {
    const allPurchaser = await axios.get(`/purchaser/getTransactionsById/${id}`);
    console.log('Purchaser Fetched - CUSTOM', allPurchaser);
    return allPurchaser.data;
  });
};

export const getPurchaserByCommodity = async purchaserCommodity => {
  return withRetry(async () => {
    const res = await fetch(`/purchaser/getPurchaserByCommodity/${purchaserCommodity}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const purchasers = await res.json();
    return purchasers;
  });
};

export const getPurchaserTransactionsBydate = async date => {
  return withRetry(async () => {
    const res = await fetch(`purchaser/getTodaysTransaction/${date}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allTransactions = await res.json();
    console.log('PURCHASER ALL TRANSACTION', allTransactions);
    return allTransactions;
  });
};
export const getPurchaserTransactionsByMonth = async month => {
  return withRetry(async () => {
    const res = await fetch(`purchaser/getTransactionByMonth/${month}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allTransactions = await res.json();
    console.log('PURCHASER ALL TRANSACTION -- Month', allTransactions);
    return allTransactions;
  });
};
export const getPurchaserTransactionsBetweenDates = async (startDate, endDate) => {
  return withRetry(async () => {
    const res = await fetch(`purchaser/getTransactionsBetweenDates/${startDate}/${endDate}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const allTransactions = await res.json();
    console.log('PURCHASER ALL TRANSACTION -- Month', allTransactions);
    return allTransactions;
  });
};

export const toFixed = (num, fixed = 2) => {
  const n = Number(num);
  if (isNaN(n)) return '';
  fixed = fixed || 0;
  const pow = Math.pow(10, fixed);
  return Math.floor(n * pow) / pow;
};

export const formatDate = (date, reduceDays) => {
  var d = new Date(date);
  if (reduceDays) {
    d.setDate(d.getDate() - reduceDays);
  }
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

export const getTodaysFormattedDate = () => {
  let todaysDate = new Date();
  let todaysDateFormatted = new Date(todaysDate.getTime() - todaysDate.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  return todaysDateFormatted;
};

export const getYearValue = year => {
  switch (year) {
    case 2022: {
      return '2022-23';
    }
    case 2023: {
      return '2023-24';
    }
    case 2024: {
      return '2024-25';
    }
    default: {
      return 'Select Year';
    }
  }
};

/**
 * Helper function to parse DD/MM/YYYY date strings properly
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {Date} Parsed Date object
 */
const parseDDMMYYYY = dateString => {
  if (typeof dateString === 'string' && dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  return new Date(dateString);
};

/**
 * Helper function to format date as DD-MM-YYYY
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
const formatDateToDDMMYYYY = date => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Get last activity date for Kisan (flat transaction array)
 * @param {Array} transactions - Flat array of transactions
 * @returns {string} Formatted date in DD-MM-YYYY format or '-'
 */
export const getKisanLastActivity = transactions => {
  try {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return '-';
    }

    // Sort by date and get the most recent
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = parseDDMMYYYY(a.date);
      const dateB = parseDDMMYYYY(b.date);
      return dateB - dateA; // Most recent first
    });

    const lastDate = sortedTransactions[0]?.date;
    if (!lastDate) return '-';

    const date = parseDDMMYYYY(lastDate);
    return isNaN(date.getTime()) ? '-' : formatDateToDDMMYYYY(date);
  } catch (error) {
    console.error('Error formatting Kisan last activity date:', error);
    return '-';
  }
};

/**
 * Get last activity date for Purchaser (grouped transaction array)
 * @param {Array} transactionGroups - Array of transaction groups with date and transactions
 * @returns {string} Formatted date in DD-MM-YYYY format or '-'
 */
export const getPurchaserLastActivity = transactionGroups => {
  try {
    if (!Array.isArray(transactionGroups) || transactionGroups.length === 0) {
      return '-';
    }

    // Sort groups by date (most recent first) and get the first one
    const sortedGroups = [...transactionGroups].sort((a, b) => {
      const dateA = parseDDMMYYYY(a.date);
      const dateB = parseDDMMYYYY(b.date);
      return dateB - dateA; // Most recent first
    });

    const lastDate = sortedGroups[0]?.date;
    if (!lastDate) return '-';

    const date = parseDDMMYYYY(lastDate);
    return isNaN(date.getTime()) ? '-' : formatDateToDDMMYYYY(date);
  } catch (error) {
    console.error('Error formatting Purchaser last activity date:', error);
    return '-';
  }
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use getKisanLastActivity or getPurchaserLastActivity instead
 */
export const formatLastActivityDate = transactions => {
  // Auto-detect format for backward compatibility
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return '-';
  }

  // Check if this is the grouped format (has transactions property)
  if (transactions[0] && transactions[0].transactions) {
    return getPurchaserLastActivity(transactions);
  } else {
    return getKisanLastActivity(transactions);
  }
};
