const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//This schema is for the one Row or document
const loginSchema = new Schema({
  userName: String,
  password: String,
  date: Date,
});

module.exports = mongoose.model("login", loginSchema);
