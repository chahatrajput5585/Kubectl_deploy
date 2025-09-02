const express = require("express");

const api = express.Router();

const userRoutes = require("./user");
const menuRoutes = require("./menu");
const orderRoutes = require("./order");

api.use("/users", userRoutes);
api.use("/menu", menuRoutes);
api.use("/orders", orderRoutes);

module.exports = api;
