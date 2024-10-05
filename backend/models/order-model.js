const mongoose = require("mongoose");

const OrderDet = new mongoose.Schema(
  {
    _item: { type: String, required: true },
    _qty: { type: Number, default: 1 },
  },
  { _id: false }
);

const Order = new mongoose.Schema({
  _userId: {
    type: String,
    required: [true, "User need to be Logged in to the application."],
  },
  _orderDet: [OrderDet],
  _bill: Number,
  _orderPlacedAt: { type: Date, default: Date.now() },
  _delAddress: {
    type: String,
    required: [true, "To place a order delivery address is needed"],
  },
  _orderStatus: {
    type: String,
    // Order Status need to confirmed by the Manager.
    default: "Unconfirmed",
  },
});

const orderModel = mongoose.model("Order", Order);

module.exports = orderModel;
