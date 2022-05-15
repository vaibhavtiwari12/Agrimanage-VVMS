const express = require("express");
const { controller } = require("../Mongo/kisanController");
const purchaserController = require("../Mongo/purchaserController.js")
const Kisan = require("../Schema/kisanSchema");
const mongoose = require("mongoose");

const KisanRouter = express.Router();

KisanRouter.get("/get", async (req, res) => {
  const allKisan = await controller("Get");
  res.json(allKisan);
});

KisanRouter.get("/getByID/:id", async (req, res) => {
  console.log("Request Params", req.params.id);
  const allKisan = await controller("FindByID", req.params.id);
  res.json(allKisan);
});

KisanRouter.post("/add", async (req, res) => {
  const newkisan = new Kisan({
    name: req.body.name,
    fatherName: req.body.fatherName,
    phone: req.body.phone,
    address: req.body.address,
    date: new Date().toString(),
    balance: 0,
    carryForwardAmount: 0,
    transactions: [],
  });
  const addedKisan = await controller("Add", newkisan);
  res.json(addedKisan);
});
KisanRouter.post("/edit", async (req, res) => {
  console.log("IS EDIT", req.body);
  const editedKisan = await controller("Edit", req.body);
  res.json(editedKisan);
});

KisanRouter.post("/AddTransaction/:id", async (req, res) => {
  var id = mongoose.Types.ObjectId();
  let purchaserDataGenerated = "";
  if(req.body.transaction && req.body.transaction.purchaserId && req.body.transaction.purchaserId !== "") {
    var id = mongoose.Types.ObjectId();
    console.log("req.body.purchaserId",req.body.transaction.purchaserId)
    purchaserDataGenerated =  await purchaserController.controller("AddTransaction", {
      id: req.body.transaction.purchaserId,
      transaction: { ...req.body.transaction, date: new Date(), _id: id },
    });
    console.log(" PURCAHSER DATA GENERATED ----> ", purchaserDataGenerated)
  }
  let addedtransaction = {};
  if(req.body.transaction.type === "DEBIT" || req.body.transaction.type === "ADVANCESETTLEMENT"){
    addedTransaction = await controller("AddTransaction", {
      id: req.params.id,
      transaction: { ...req.body.transaction, date: new Date(), _id: id },
    });
  }else {
    const purchaseTxnId = purchaserDataGenerated._id ? purchaserDataGenerated._id.toString() : ""
    addedTransaction = await controller("AddTransaction", {
      id: req.params.id,
      transaction: { ...req.body.transaction, date: new Date(), _id: id, purchaserTxnId: purchaseTxnId},
    });
  }
  res.json(addedTransaction);
});

KisanRouter.post("/DeleteTransacton/:id", async (req, res) => {
  const addedTransaction = await controller("deleteTransaction", {
    id: req.params.id,
    kisanTxnId: req.body.kisanTxnId,
    purchaseId: req.body.purchaserId,
    purchaserTxnId: req.body.purchaserTxnId,
    inventoryItemId: req.body.inventoryItemId,
    inventoryTxnId : req.body.inventoryTxnId,
  });
  res.json(addedTransaction);
});
KisanRouter.post("/DeleteDebitTransaction", async (req, res) => {
  const addedTransaction = await controller("deleteDebitTransaction", {
    kisanId: req.body.kisanId,
    transactionID : req.body.transactionID
  });
  res.json(addedTransaction);
});
KisanRouter.post("/DeleteAdvanceSettlementTransaction", async (req, res) => {
  const addedTransaction = await controller("DeleteAdvanceSettlementTransaction", {
    kisanId: req.body.kisanId,
    transactionID : req.body.transactionID
  });
  res.json(addedTransaction);
});

KisanRouter.post("/editTransaction/:id", async (req, res) => {
  const editedTransaction = await controller("editTransaction", {
    id: req.params.id,
    transactionNumber: req.body.transactionNumber,
    comment: req.body.comment,
  });
  res.json(editedTransaction);
});

KisanRouter.get("/getTodaysTransaction/:dateToSearch", async (req, res) => {
  const todaysTransaction = await controller("todaystransactions", {
    dateToSearch: req.params.dateToSearch,
  });
  console.log("todaystransactions", todaysTransaction);
  res.json(todaysTransaction);
});

KisanRouter.get("/getTransactionByMonth/:monthToSearch", async (req, res) => {
  const monthsTransaction = await controller("monthTransaction", {
    monthToSearch: req.params.monthToSearch,
  });
  console.log("monthsTransaction", monthsTransaction);
  res.json(monthsTransaction);
});
KisanRouter.get(
  "/getTransactionsBetweenDates/:startDate/:endDate",
  async (req, res) => {
    const monthsTransaction = await controller("transactionBetweenDates", {
      startDate: req.params.startDate,
      endDate: req.params.endDate,
      type: "kisan",
    });
    console.log("between Dates", monthsTransaction);
    res.json(monthsTransaction);
  }
);

module.exports = KisanRouter;
