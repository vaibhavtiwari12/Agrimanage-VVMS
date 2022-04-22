const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const transactions = new Schema({
  numberofBags: Number,
  totalweight: Number,
  rate: Number,
  type: String,
  kisan: String,
  kisanName: String,
  transactionAmount: Number,
  date: Date,
  balanceAfterThisTransaction: Number
});
//This schema is for the one Row or document
const purchaserSchema = new Schema({
  serial: ObjectId,
  name: String,
  companyName: String,
  phone: Number,
  address: String,
  date: Date,
  balance: Number,
  transactions: [transactions],
});

module.exports = mongoose.model("Purchaser", purchaserSchema);
