const express = require("express");
const { controller } = require("../Mongo/inventoryController");
const Inventory = require("../Schema/inventorySchema");
const mongoose = require("mongoose");

const InventoryRouter = express.Router();

InventoryRouter.get("/get", async (req, res) => {
  const allInventory = await controller("Get");
  res.json(allInventory);
});

InventoryRouter.get("/getByID/:id", async (req, res) => {
  const allInventory = await controller("FindByID", req.params.id);
  res.json(allInventory);
});

InventoryRouter.post("/add", async (req, res) => {
  const newItem = new Inventory({
    itemName: req.body.name,
    date: new Date(),
    totalWeight: 0,
    totalBags: 0,
    transactions: [],
  });
  const addedInventory = await controller("Add", newItem);
  res.json(addedInventory);
});
/* 
inventoryRouter.post("/AddTransaction/:id", async (req, res) => {
  var id = mongoose.Types.ObjectId();
  const addedTransaction = await controller("AddTransaction", {
    id: req.params.id,
    transaction: { ...req.body.transaction, date: new Date(), _id: id },
  });
  res.json(addedTransaction);
});

inventoryRouter.post("/editTransaction/:id", async (req, res) => {
  const editedTransaction = await controller("editTransaction", {
    id: req.params.id,
    transactionNumber: req.body.transactionNumber,
    comment: req.body.comment,
  });
  res.json(editedTransaction);
});

inventoryRouter.get("/getTodaysTransaction/:dateToSearch", async (req, res) => {
  const todaysTransaction = await controller("todaystransactions", {
    dateToSearch: req.params.dateToSearch,
  });
  console.log("todaystransactions", todaysTransaction);
  res.json(todaysTransaction);
});

inventoryRouter.get("/getTransactionByMonth/:monthToSearch", async (req, res) => {
  const monthsTransaction = await controller("monthTransaction", {
    monthToSearch: req.params.monthToSearch,
  });
  console.log("monthsTransaction", monthsTransaction);
  res.json(monthsTransaction);
});
inventoryRouter.get(
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

module.exports = InventoryRouter;
