const fs = require("fs");
const Food = require("../models/food-model");
const orderModel = require("../models/order-model");

const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));
const foods = JSON.parse(fs.readFileSync(`./dev-data/foods.json`));

module.exports.getAllUsers = function (req, res) {
  const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));
  res.status(200).json({ status: "Success", data: users });
};

module.exports.deleteAllUsers = function (req, res) {
  fs.writeFileSync(`./dev-data/users.json`, "[]");
  res.status(204).json({ status: "Success", message: "All Users Deleted" });
};

// GET DELETE UPDATE CREATE - USERS Route
module.exports.getUser = function (req, res) {
  const user = users.find((cur) => cur._uid == req.params.id);
  res.status(200).json({ status: "Success", data: user });
};

module.exports.deleteUser = function (req, res) {
  const user = users.find((cur) => cur._uid == req.params.id);
  users.splice(users.indexOf(user), 1);
  fs.writeFileSync(`./dev-data/users.json`, JSON.stringify(users));
  res.status(200).json({ status: "Success", message: "User deleted" });
};

module.exports.addUser = function (req, res) {
  const user = { _uid: req.userId, details: req.body };
  users.push(user);
  fs.writeFileSync(`./dev-data/users.json`, JSON.stringify(users));
  res.status(201).json({ status: "Success", message: "User Created" });
};

module.exports.updateUser = function (req, res) {
  // TODO: 1 Get the Particular User
  const user = users.find((cur) => cur._uid == req.params.id);
  // TODO: 2 Store the Requested Info from the Body which are need to be updated
  const reqData = req.body;
  const index = users.indexOf(user);

  if (!reqData.hasOwnProperty("_uid")) {
    // FOR OF LOOP [It is a loop condition over any object data and returns the values of the iterable.]
    for (const [key, value] of Object.entries(reqData)) {
      user[key] = value;
    }
    // TODO: 3 Add the Updated User info into the Users ARRAY
    users.splice(index, 1, user);
    fs.writeFileSync(`./dev-data/users.json`, JSON.stringify(users));
    res.status(200).json({ status: "Success", data: user });
  } else {
    res
      .status(400)
      .json({ status: "Unsuccessful", message: "User ID cannot be changed" });
  }
};

// ----NOTE: ORDERING FOOD IN REAL TIME DB
module.exports.orderFood = async function (req, res) {
  try {
    const userId = req.query.uid;
    const order = req.body._order;

    const newOrder = {
      _userId: userId,
      _orderDet: order,
      // Initial Value
      _bill: 0,
      // TODO: In Future GEO LOCATION
      _delAddress: req.body._delAddress,
    };

    // Calculate Total Amount
    for (const [key, { _item, _qty }] of Object.entries(order)) {
      const food = await Food.findOne({ _foodName: _item });
      newOrder._bill += food._price * _qty;
    }

    // Sending the Data
    const data = await orderModel.create(newOrder);
    // Order Details
    res.status(200).json({
      status: "Success",
      message: "Order is awaiting for the future response.",
    });
  } catch (err) {
    res.status(400).json({ status: "Unsuccessful", message: err.message });
  }
};

// ----NOTE: ORDERING FOOD USING THE BUILT IN NODE MODULES [FS]
// {
//   "_orderId": "O-23-072024-001",
//   "_orderDet": {
//     "_userID": "U01",
//     "_empID": "E01",
//     "_order": [
//       { "_item": "F01", "_qty": 3 },
//       { "_item": "F03", "_qty": 1 }
//     ],
//     "_bill": "Need to be calculated"
//   },
//  TODO: completion Time and the customer review need to be added at the time of placing the order.
//   "_orderCompTime": "current date and time in ISO String format",
//   "_about": "Customer review"
// }

// ORDER FOOD
// module.exports.order = function (req, res) {
//   const orders = JSON.parse(fs.readFileSync("./dev-data/food-orders.json"));
//   const info = req.body._order;

//   // Add Order ID value
//   const now = new Date();
//   const month = now.getMonth() + 1;
//   const serial = function (num) {
//     num = num.toString();
//     while (num.length < 3) num = "0" + num;
//     return num;
//   };

//   const newOrder = {
//     _orderId: `O-${now.getDate()}-${
//       (month < 10 ? "0" + month : month).toString() + now.getFullYear()
//     }-${serial(orders.length + 1)}`,
//     // Empty Order property
//     _orderDet: {},
//     _bill: 0,
//     _orderCompTime: new Date().toISOString(),
//     _about: {
//       _f: "About Food",
//       _d: "About Delivery person",
//       _e: "About the Employee",
//     },
//   };

//   // Calculate Total Amount
//   for (const [key, { _item, _qty }] of Object.entries(info)) {
//     // [0,{_item:"F01",_qty:3}]
//     const food = foods.find((cur) => cur._fid == _item);
//     newOrder._bill += food._details._price * _qty;
//   }

//   // TODO: In User and Employee Details must be added with the request Data
//   if (req.body.hasOwnProperty("_uID") && req.body.hasOwnProperty("_eID")) {
//     newOrder._orderDet._userID = req.body._uID;
//     newOrder._orderDet._empID = req.body._eID;
//     // Order
//     newOrder._orderDet._order = new Array(...info);
//     orders.push(newOrder);
//     fs.writeFileSync("./dev-data/food-orders.json", JSON.stringify(orders));
//     res.status(201).json({ status: "Success", newOrder });
//   } else {
//     res
//       .status(400)
//       .json({ status: "Unacceptable", message: "Not enough info" });
//   }
// };
