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
