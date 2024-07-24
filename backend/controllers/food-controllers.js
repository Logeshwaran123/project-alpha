const fs = require("fs");

const foods = JSON.parse(fs.readFileSync("./dev-data/foods.json"));

module.exports.getFoods = function (req, res) {
  const foods = JSON.parse(fs.readFileSync("./dev-data/foods.json"));
  res.status(200).json({ status: "Success", data: foods });
};

module.exports.getFood = function (req, res) {
  const food = foods.find((cur) => cur._fid == req.params.id);
  if (!food) {
    res.status(404).json({ status: "Unsuccessful", message: "Item not found" });
  } else {
    res.status(200).json({ status: "Successful", data: food });
  }
};

module.exports.addFood = function (req, res) {
  const food = { _fid: req.foodId, details: req.body };
  foods.push(food);
  fs.writeFileSync(`./dev-data/foods.json`, JSON.stringify(foods));
  res.status(201).json({ status: "Success", message: "Food Created" });
};

module.exports.updateFood = function (req, res) {
  const food = foods.find((cur) => cur._fid == req.params.id);
  if (!food) {
    res.status(404).json({ status: "Unsuccessful", message: "Item not found" });
  } else {
    const reqData = req.body;
    const index = foods.indexOf(food);
    if (!reqData.hasOwnProperty("_fid")) {
      // FOR OF LOOP [It is a loop condition over any object data and returns the values of the iterable.]
      for (const [key, value] of Object.entries(reqData)) {
        food[key] = value;
      }
      // TODO: 3 Add the Updated User info into the Users ARRAY
      foods.splice(index, 1, food);
      fs.writeFileSync(`./dev-data/foods.json`, JSON.stringify(foods));
      res.status(200).json({ status: "Success", data: food });
    }
  }
};

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
module.exports.order = function (req, res) {
  const orders = JSON.parse(fs.readFileSync("./dev-data/food-orders.json"));
  const info = req.body._order;

  // Add Order ID value
  const now = new Date();
  const month = now.getMonth() + 1;
  const serial = function (num) {
    num = num.toString();
    while (num.length < 3) num = "0" + num;
    return num;
  };

  const newOrder = {
    _orderId: `O-${now.getDate()}-${
      (month < 10 ? "0" + month : month).toString() + now.getFullYear()
    }-${serial(orders.length + 1)}`,
    // Empty Order property
    _orderDet: {},
    _bill: 0,
    _orderCompTime: new Date().toISOString(),
    _about: {
      _f: "About Food",
      _d: "About Delivery person",
      _e: "About the Employee",
    },
  };

  // Calculate Total Amount
  for (const [key, { _item, _qty }] of Object.entries(info)) {
    const food = foods.find((cur) => cur._fid == _item);
    newOrder._bill += food._details._price * _qty;
  }

  // TODO: In User and Employee Details must be added with the request Data
  if (req.body.hasOwnProperty("_uID") && req.body.hasOwnProperty("_eID")) {
    newOrder._orderDet._userID = req.body._uID;
    newOrder._orderDet._empID = req.body._eID;
    // Order
    newOrder._orderDet._order = new Array(...info);
    orders.push(newOrder);
    fs.writeFileSync("./dev-data/food-orders.json", JSON.stringify(orders));
    res.status(201).json({ status: "Success", newOrder });
  } else {
    res
      .status(400)
      .json({ status: "Unacceptable", message: "Not enough info" });
  }
};
