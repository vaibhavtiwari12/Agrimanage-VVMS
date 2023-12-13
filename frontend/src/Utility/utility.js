import axios from 'axios';
export const getAllKisan = async () => {
  const res = await fetch("/kisan/get");
  const allKisan = await res.json();
  return allKisan;
};

export const getKisanByID = async (id) => {
  const res = await fetch(`/kisan/getByID/${id}`);
  const allKisan = await res.json();
  console.log("Result of getkisanById");
  return allKisan;
};

export const setYearChange = async (changedYear) => {
  await axios.post('/yearChange',{
    year: parseInt(changedYear)
  })
}

export const dateConverter = (date) => {
  const D = new Date(date);
  const formattedDate = `${D.getDate()}/${
    D.getMonth() + 1
  }/${D.getFullYear()} ${D.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  })}`;
  return formattedDate;
};

export const convertOnlyDate = (date) => {
  const D = new Date(date);
  const formattedDate = `${D.getFullYear()}-${("0" + (D.getMonth() + 1)).slice(
    -2
  )}-${("0" + D.getDate()).slice(-2)}`;
  return formattedDate;
};
export const getOnlyMonth = (date) => {
  const D = new Date(date);
  const formattedDate = `${D.getFullYear()}-${("0" + (D.getMonth() + 1)).slice(
    -2
  )}`;
  return formattedDate;
};

export const getTransactionsBydate = async (date) => {
  const res = await fetch(`kisan/getTodaysTransaction/${date}`);
  const allTransactions = await res.json();
  console.log("ALL TRANSACTION", allTransactions);
  return allTransactions;
};
export const getTransactionsByMonth = async (month) => {
  const res = await fetch(`kisan/getTransactionByMonth/${month}`);
  const allTransactions = await res.json();
  console.log("ALL TRANSACTION -- Month", allTransactions);
  return allTransactions;
};
export const getTransactionsBetweenDates = async (startDate, endDate) => {
  const res = await fetch(
    `kisan/getTransactionsBetweenDates/${startDate}/${endDate}`
  );
  const allTransactions = await res.json();
  console.log("ALL TRANSACTION -- Month", allTransactions);
  return allTransactions;
};

/* PUrchaser Module */
export const getAllPurchasers = async () => {
  const purchasers = await axios.get('/purchaser/get');
  return purchasers;
}

export const getPurchaserById = async (id) => {
  const allPurchaser = await axios.get(`/purchaser/getByID/${id}`);
  return allPurchaser.data;
};

export const fetchCustomTransactionsForPurchaser = async  (id) => {
  const allPurchaser = await axios.get(`/purchaser/getTransactionsById/${id}`);
  console.log("Purchaser Fetched - CUSTOM", allPurchaser)
  return allPurchaser.data;
}

export const getPurchaserByCommodity = async (purchaserCommodity) => {
  const res = await fetch(`/purchaser/getPurchaserByCommodity/${purchaserCommodity}`);
  const purchasers = await res.json();
  return purchasers;
};

export const getPurchaserTransactionsBydate = async (date) => {
  const res = await fetch(`purchaser/getTodaysTransaction/${date}`);
  const allTransactions = await res.json();
  console.log("PURCHASER ALL TRANSACTION", allTransactions);
  return allTransactions;
};
export const getPurchaserTransactionsByMonth = async (month) => {
  const res = await fetch(`purchaser/getTransactionByMonth/${month}`);
  const allTransactions = await res.json();
  console.log("PURCHASER ALL TRANSACTION -- Month", allTransactions);
  return allTransactions;
};
export const getPurchaserTransactionsBetweenDates = async (startDate, endDate) => {
  const res = await fetch(
    `purchaser/getTransactionsBetweenDates/${startDate}/${endDate}`
  );
  const allTransactions = await res.json();
  console.log("PURCHASER ALL TRANSACTION -- Month", allTransactions);
  return allTransactions;
};

export const toFixed = (num, fixed = 2) => {
  if(typeof(num) !== 'number') return ""
  fixed = fixed || 0;
  fixed = Math.pow(10, fixed);
  return Math.floor(num * fixed) / fixed;
}

export const formatDate = (date, reduceDays) => {
  var d = new Date(date)
  if(reduceDays){
    d.setDate(d.getDate() - reduceDays);
  }
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let year = d.getFullYear();

  if (month.length < 2)
     month = '0' + month;
  if (day.length < 2)
     day = '0' + day;

  return [year, month, day].join('-');
}

export const getTodaysFormattedDate = () => {
  let todaysDate = new Date()
  let todaysDateFormatted = new Date(todaysDate.getTime() - (todaysDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
  return todaysDateFormatted;
}