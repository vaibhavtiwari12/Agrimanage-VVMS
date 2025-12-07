const express = require('express');
const { controller } = require('../Mongo/kisanController');
const purchaserController = require('../Mongo/purchaserController.js');
const Kisan = require('../Schema/kisanSchema');
const mongoose = require('mongoose');
const { getKisanModel } = require('../Model/model');
const moment = require('moment');

const KisanRouter = express.Router();
//making comment to make commit
KisanRouter.get('/get', async (req, res) => {
  // Pagination, sorting, and filtering support
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const searchTerm = req.query.searchTerm || '';
  const searchType = req.query.searchType || 'Name';
  const itemType = req.query.itemType || '';
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;
  const Kisan = getKisanModel();

  let filter = {};
  if (itemType) {
    filter.kisanCommodity = itemType;
  }
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    if (searchType === 'Name') filter.name = regex;
    else if (searchType === 'FatherName') filter.fatherName = regex;
    else if (searchType === 'PhoneNumber') {
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

  const total = await Kisan.countDocuments(filter);
  const kisans = await Kisan.find(filter)
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  res.json({ kisans, total });
});

KisanRouter.get('/getByID/:id', async (req, res) => {
  console.log('Request Params', req.params.id);
  const allKisan = await controller('FindByID', req.params.id);
  res.json(allKisan);
});

KisanRouter.post('/add', async (req, res) => {
  const Kisan = getKisanModel();
  const newkisan = new Kisan({
    name: req.body.name,
    fatherName: req.body.fatherName,
    phone: req.body.phone,
    address: req.body.address,
    date: new Date().toString(),
    balance: 0,
    carryForwardAmount: 0,
    kisanCommodity: req.body.kisanCommodity,
    transactions: [],
  });
  const addedKisan = await controller('Add', newkisan);
  res.json(addedKisan);
});
KisanRouter.post('/edit', async (req, res) => {
  const editedKisan = await controller('Edit', req.body);
  res.json(editedKisan);
});
const checkMaxDate = maxDate => {
  const hours = maxDate.getHours();
  const minutes = maxDate.getMinutes();
  const seconds = maxDate.getSeconds();
  if (hours === 23 && minutes === 59 && seconds === 59) {
    return true;
  }
  return false;
};

const getKisanDate = async req => {
  let date = new Date();
  if (
    req.body.transaction &&
    req.body.transaction.backDate &&
    req.body.transaction.backDate.length > 0
  ) {
    date = new Date(req.body.transaction.backDate);
    const kisanDetails = await controller('FindByID', req.params.id);
    //console.log("kisanDetails ", kisanDetails)
    if (kisanDetails?.transactions?.length > 0) {
      //Get the transactions for the back Date
      const kisantransactionsForTheBackDate = kisanDetails.transactions.filter(txn => {
        //console.log("Transaction Date ---------------------", txn.date)
        const txn_date = new Date(txn.date);
        const txnDate = txn_date.toISOString().split('T', 1)[0];
        console.log('txnDate', txnDate);
        if (req.body.transaction.backDate === txnDate) {
          return txn;
        }
      });
      //console.log("kisantransactionsForTheBackDate ", kisantransactionsForTheBackDate)
      if (kisantransactionsForTheBackDate?.length > 0) {
        // then add 1 second to the max time of the transactions of that day. if time is 11.59.59 then add just 1 milliseconds.
        const max_date = kisantransactionsForTheBackDate.reduce((a, b) =>
          moment(a.date).isAfter(b.date) ? a : b
        ).date;
        //console.log("max_date", max_date)
        const max_date_opr = new Date(max_date);
        const isMaxDate115959 = checkMaxDate(max_date_opr);
        if (!isMaxDate115959) {
          max_date_opr.setSeconds(max_date_opr.getSeconds() + 1);
        } else {
          max_date_opr.setSeconds(max_date_opr.getMilliseconds() + 1);
        }
        //console.log("max_date_opr", max_date_opr)
        date = max_date_opr.toISOString();
      } else {
        //console.log("in else of backDate length");
        date.setHours(0, 1, 0, 999);
      }
    } else {
      //console.log("in else of transactions length");
      //   set the time for 12.01.00
      date.setHours(0, 1, 0, 999);
    }
  }
  return date;
};

KisanRouter.post('/AddTransaction/:id', async (req, res) => {
  var id = mongoose.Types.ObjectId();
  let purchaserDataGenerated = '';
  if (
    req.body.transaction &&
    req.body.transaction.purchaserId &&
    req.body.transaction.purchaserId !== ''
  ) {
    var id = mongoose.Types.ObjectId();
    let purchaser_date = new Date();

    let date = new Date();
    if (
      req.body.transaction &&
      req.body.transaction.backDate &&
      req.body.transaction.backDate.length > 0
    ) {
      date = await getKisanDate(req);
      // Fetching th details of purchaser
      /* Get maximum date from the purchaser transactions and then add 1 second to that 
      as otherwise it will break the purchsaer transaction table sequence and hence will show
      wrong calculation while printing in purchaser 
      */

      const purchaserTxns = await purchaserController.controller(
        'FindByID',
        req.body.transaction.purchaserId
      );
      if (purchaserTxns?.transactions?.length > 0) {
        const purchaserTransactionsOfParticularBackDate = purchaserTxns.transactions.filter(txn => {
          const txnDate = txn.date.toISOString().split('T', 1)[0];
          //console.log("req.body.transaction.backDate",req.body.transaction.backDate,  " txnDate",txnDate, "equality",  req.body.transaction.backDate=== txnDate)
          if (req.body.transaction.backDate === txnDate) {
            return txn;
          }
        });
        //console.log("purchaserTransactionsOfParticularBackDate", purchaserTransactionsOfParticularBackDate)
        if (purchaserTransactionsOfParticularBackDate?.length > 0) {
          const max_date = purchaserTransactionsOfParticularBackDate.reduce((a, b) =>
            moment(a.date).isAfter(b.date) ? a : b
          ).date;
          //console.log("max_date", max_date)
          const max_date_opr = new Date(max_date);
          max_date_opr.setSeconds(max_date_opr.getSeconds() + 1);
          purchaser_date = max_date_opr.toISOString();
          // console.log("purchaser_date in IF", purchaser_date)
        } else {
          purchaser_date = date;
          //console.log("Setting Date in else ====== ", purchaser_date)
        }
      } else {
        // console.log("Setting Date in else bahar wala ====== ", purchaser_date)
        purchaser_date = date;
      }
    }

    purchaserDataGenerated = await purchaserController.controller('AddTransaction', {
      id: req.body.transaction.purchaserId,
      transaction: {
        ...req.body.transaction,
        date: purchaser_date,
        _id: id,
        creationDate: new Date(),
      },
    });
  }
  let addedtransaction = {};
  if (req.body.transaction.type === 'DEBIT' || req.body.transaction.type === 'ADVANCESETTLEMENT') {
    date = await getKisanDate(req);
    addedTransaction = await controller('AddTransaction', {
      id: req.params.id,
      transaction: { ...req.body.transaction, date: date, _id: id, creationDate: new Date() },
    });
  } else {
    const purchaseTxnId = purchaserDataGenerated._id ? purchaserDataGenerated._id.toString() : '';
    date = await getKisanDate(req);
    addedTransaction = await controller('AddTransaction', {
      id: req.params.id,
      transaction: {
        ...req.body.transaction,
        date: date,
        _id: id,
        purchaserTxnId: purchaseTxnId,
        creationDate: new Date(),
      },
    });
  }
  res.json(addedTransaction);
});

KisanRouter.post('/DeleteTransacton/:id', async (req, res) => {
  const addedTransaction = await controller('deleteTransaction', {
    id: req.params.id,
    kisanTxnId: req.body.kisanTxnId,
    purchaseId: req.body.purchaserId,
    purchaserTxnId: req.body.purchaserTxnId,
    inventoryItemId: req.body.inventoryItemId,
    inventoryTxnId: req.body.inventoryTxnId,
  });
  res.json(addedTransaction);
});
KisanRouter.post('/DeleteDebitTransaction', async (req, res) => {
  const addedTransaction = await controller('deleteDebitTransaction', {
    kisanId: req.body.kisanId,
    transactionID: req.body.transactionID,
  });
  res.json(addedTransaction);
});
KisanRouter.post('/DeleteAdvanceSettlementTransaction', async (req, res) => {
  const addedTransaction = await controller('DeleteAdvanceSettlementTransaction', {
    kisanId: req.body.kisanId,
    transactionID: req.body.transactionID,
  });
  res.json(addedTransaction);
});

KisanRouter.post('/editTransaction/:id', async (req, res) => {
  const editedTransaction = await controller('editTransaction', {
    id: req.params.id,
    transactionNumber: req.body.transactionNumber,
    comment: req.body.comment,
  });
  res.json(editedTransaction);
});

KisanRouter.get('/getTodaysTransaction/:dateToSearch', async (req, res) => {
  const todaysTransaction = await controller('todaystransactions', {
    dateToSearch: req.params.dateToSearch,
  });
  res.json(todaysTransaction);
});

KisanRouter.get('/getTransactionByMonth/:monthToSearch', async (req, res) => {
  const monthsTransaction = await controller('monthTransaction', {
    monthToSearch: req.params.monthToSearch,
  });
  res.json(monthsTransaction);
});
KisanRouter.get('/getTransactionsBetweenDates/:startDate/:endDate', async (req, res) => {
  const monthsTransaction = await controller('transactionBetweenDates', {
    startDate: req.params.startDate,
    endDate: req.params.endDate,
    type: 'kisan',
  });
  res.json(monthsTransaction);
});
KisanRouter.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await controller('DeleteKisan', req.params.id);
    res.json({ success: true, deleted });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = KisanRouter;
