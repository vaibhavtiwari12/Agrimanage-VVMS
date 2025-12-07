const express = require('express');
const { controller } = require('../Mongo/purchaserController');
const { getPurchaserModel } = require('../Model/model');

const purchaserRouter = express.Router();

// --- REWRITE: Server-side pagination, sorting, filtering ---
purchaserRouter.get('/get', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const searchTerm = req.query.searchTerm || '';
  const searchType = req.query.searchType || 'Name';
  const itemType = req.query.itemType || '';
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;
  const Purchaser = getPurchaserModel();

  let filter = {};
  if (itemType) {
    filter.purchaserCommodity = itemType;
  }
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    if (searchType === 'Name') filter.name = regex;
    else if (searchType === 'companyName') filter.companyName = regex;
    else if (searchType === 'phone') {
      // Only search if exactly 10 digits entered
      if (searchTerm.length === 10 && /^\d{10}$/.test(searchTerm)) {
        filter.phone = Number(searchTerm);
      } else {
        // Return empty result if not 10 digits
        filter.phone = null;
      }
    }
  }

  let sort = {};
  if (sortField && sortOrder) {
    sort[sortField] = parseInt(sortOrder, 10);
  }

  try {
    const total = await Purchaser.countDocuments(filter);
    const purchasers = await Purchaser.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    res.json({ purchasers, total });
  } catch (error) {
    console.error('Error fetching purchasers:', error);
    res.status(500).json({ error: 'Failed to fetch purchasers' });
  }
});

purchaserRouter.get('/getByID/:id', async (req, res) => {
  console.log('Request Params', req.params.id);
  const allKisan = await controller('FindByID', req.params.id);
  res.json(allKisan);
});

purchaserRouter.post('/add', async (req, res) => {
  console.log('Purchaser Add', req.body);
  const addedPurchaser = await controller('Add', req.body);
  res.json(addedPurchaser);
});

purchaserRouter.post('/DeleteTransacton', async (req, res) => {
  console.log('Purchaser Delete Transaction', req.body);
  const deletedPurchaser = await controller('DeleteTransaction', req.body);
  res.json(deletedPurchaser);
});

purchaserRouter.post('/edit', async (req, res) => {
  console.log('Purchaser Edit', req.body);
  const editedPurchaser = await controller('Edit', req.body);
  res.json(editedPurchaser);
});

purchaserRouter.post('/AddCreditTransaction/:id', async (req, res) => {
  const addedTransaction = await controller('AddCreditTransaction', {
    id: req.params.id,
    transaction: { ...req.body.transaction, date: new Date() },
  });
  res.json(addedTransaction);
});

purchaserRouter.get('/getTransactionsById/:id', async (req, res) => {
  console.log('Request Params', req.params.id);
  const allKisan = await controller('findByCustomTransactions', req.params.id);
  res.json(allKisan);
});

purchaserRouter.get('/getTodaysTransaction/:dateToSearch', async (req, res) => {
  const todaysTransaction = await controller('todaystransactions', {
    dateToSearch: req.params.dateToSearch,
  });
  //console.log("todaystransactions - Purchaser", todaysTransaction);
  res.json(todaysTransaction);
});

purchaserRouter.get('/getTransactionByMonth/:monthToSearch', async (req, res) => {
  const monthsTransaction = await controller('monthTransaction', {
    monthToSearch: req.params.monthToSearch,
  });
  res.json(monthsTransaction);
});

purchaserRouter.get('/getTransactionsBetweenDates/:startDate/:endDate', async (req, res) => {
  const monthsTransaction = await controller('transactionBetweenDates', {
    startDate: req.params.startDate,
    endDate: req.params.endDate,
    type: 'purchaser',
  });
  res.json(monthsTransaction);
});

purchaserRouter.get('/getPurchaserByCommodity/:purchaserCommodity', async (req, res) => {
  const editedTransaction = await controller('getPurchaserByCommodity', {
    purchaserCommodity: req.params.purchaserCommodity,
  });
  res.json(editedTransaction);
});

/*
purchaserRouter.post("/editTransaction/:id", async (req, res) => {
  const editedTransaction = await controller("editTransaction", {
    id: req.params.id,
    transactionNumber: req.body.transactionNumber,
    comment: req.body.comment,
  });
  res.json(editedTransaction);
});

purchaserRouter.get("/getTodaysTransaction/:dateToSearch", async (req, res) => {
  const todaysTransaction = await controller("todaystransactions", {
    dateToSearch: req.params.dateToSearch,
  });
  console.log("todaystransactions", todaysTransaction);
  res.json(todaysTransaction);
});

purchaserRouter.get("/getTransactionByMonth/:monthToSearch", async (req, res) => {
  const monthsTransaction = await controller("monthTransaction", {
    monthToSearch: req.params.monthToSearch,
  });
  console.log("monthsTransaction", monthsTransaction);
  res.json(monthsTransaction);
});
purchaserRouter.get(
  "/getTransactionsBetweenDates/:startDate/:endDate",
  async (req, res) => {
    const monthsTransaction = await controller("transactionBetweenDates", {
      startDate: req.params.startDate,
      endDate: req.params.endDate,
    });
    console.log("between Dates", monthsTransaction);
    res.json(monthsTransaction);
  }
); */

module.exports = purchaserRouter;
