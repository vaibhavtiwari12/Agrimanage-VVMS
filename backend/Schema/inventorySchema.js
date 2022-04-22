const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const transactions = new Schema({
  kisanName: String,
  kisanID: String,
  numberofBags: Number,
  totalweight: Number,
  rate: Number,
  date: Date,
  purchaserId : String,
  purchaserName: String
});
//This schema is for the one Row or document
const InventorySchema = new Schema({
  serial: ObjectId,
  itemName: String,
  date: Date,
  totalWeight: Number,
  totalBags: Number,
  transactions: [transactions],
});

module.exports = mongoose.model("Inventory", InventorySchema);
