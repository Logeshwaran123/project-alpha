const orderModel = require("../models/order-model");

module.exports.getOrders = async function (req, res) {
  try {
    const orders = await orderModel.find();
    res.status(200).json({ status: "Success", orders });
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};
