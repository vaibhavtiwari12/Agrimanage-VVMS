const express = require("express");
const { controller } = require("../Mongo/loginController");
const login = require("../Schema/loginSchema");
const mongoose = require("mongoose");

const loginRouter = express.Router();

loginRouter.post("/addUser", async (req, res) => {
console.log("Request ", req.body)
  const logins = await controller("add", {
    userName: req.body.userName,
    password: req.body.password,
  });
  res.json(logins);
});

module.exports = loginRouter;
