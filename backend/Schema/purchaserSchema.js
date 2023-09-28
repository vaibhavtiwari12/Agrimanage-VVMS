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
  comment: String,
  balanceAfterThisTransaction: Number,
  creationDate: Date
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
  comment: String,
  purchaserCommodity: String,
  transactions: [transactions],
});

module.exports = purchaserSchema;
