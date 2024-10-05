const orderControllers = require("../controllers/order-controllers");
const express = require("express");
const orderRoute = express.Router();

orderRoute
  .route("/orders")
  .get((req, res) => orderControllers.getOrders(req, res));

module.exports = orderRoute;
