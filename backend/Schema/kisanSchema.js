const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//This schema is for the one Row or document
const KisanSchema = new Schema({
  serial: ObjectId,
  name: String,
  fatherName: String,
  phone: Number,
  address: String,
  date: Date,
  balance: Number,
  carryForwardAmount: Number,
  transactions: [],
});

module.exports = mongoose.model("Kisan", KisanSchema);
