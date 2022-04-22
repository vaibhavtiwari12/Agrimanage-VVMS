const express = require("express");
const { controller } = require("../Mongo/purchaserController");

const purchaserRouter = express.Router();

purchaserRouter.get("/get", async (req, res) => {
  const allPurchasers = await controller("Get");
  res.json(allPurchasers);
});

purchaserRouter.get("/getByID/:id", async (req, res) => {
  console.log("Request Params", req.params.id);
  const allKisan = await controller("FindByID", req.params.id);
  res.json(allKisan);
});

purchaserRouter.post("/add", async (req, res) => {
  console.log("Purchaser Add", req.body);
  const addedPurchaser = await controller("Add", req.body);
  res.json(addedPurchaser);
});

purchaserRouter.post("/edit", async (req, res) => {
  console.log("Purchaser Edit", req.body);
  const editedPurchaser = await controller("Edit", req.body);
  res.json(editedPurchaser);
});

purchaserRouter.post("/AddCreditTransaction/:id", async (req, res) => {
  const addedTransaction = await controller("AddCreditTransaction", {
    id: req.params.id,
    transaction: { ...req.body.transaction, date: new Date()},
  });
  res.json(addedTransaction);
});

purchaserRouter.get("/getTransactionsById/:id", async (req, res) => {
  console.log("Request Params", req.params.id);
  const allKisan = await controller("findByCustomTransactions", req.params.id);
  res.json(allKisan);
});

purchaserRouter.get("/getTodaysTransaction/:dateToSearch", async (req, res) => {
  const todaysTransaction = await controller("todaystransactions", {
    dateToSearch: req.params.dateToSearch,
  });
  //console.log("todaystransactions - Purchaser", todaysTransaction);
  res.json(todaysTransaction);
});

purchaserRouter.get("/getTransactionByMonth/:monthToSearch", async (req, res) => {
  const monthsTransaction = await controller("monthTransaction", {
    monthToSearch: req.params.monthToSearch,
  });
  console.log("monthsTransaction - Purchaser", monthsTransaction);
  res.json(monthsTransaction);
});

purchaserRouter.get(
  "/getTransactionsBetweenDates/:startDate/:endDate",
  async (req, res) => {
    const monthsTransaction = await controller("transactionBetweenDates", {
      startDate: req.params.startDate,
      endDate: req.params.endDate,
      type: "purchaser",
    });
    console.log("between Dates - Purchaser", monthsTransaction);
    res.json(monthsTransaction);
  }
);

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
