const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//This schema is for the one Row or document
const dashboard = new Schema({
  data : {}
});

module.exports = mongoose.model("dashboard", dashboard);
