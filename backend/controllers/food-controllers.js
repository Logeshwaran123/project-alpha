const Food = require("../models/food-model");
const APIFeatures = require("../utils/api-features");

// TOP SELLERS
module.exports.topSellers = function (req, res, next) {
  req.query.limit = "2";
  req.query.sort = "-_ratings,_price";
  req.query.field = "_foodName,_price,_ratings";
  next();
};

module.exports.getFood = async function (req, res) {
  try {
    console.log(typeof req.params.id);
    const food = await Food.findById(req.params.id);
    if (!food) throw "Item Not Found";
    res.status(200).json({ status: "Success", data: food });
  } catch (err) {
    res
      .status(404)
      .json({ status: "Unsuccessful", message: err || "Data Not in there" });
  }
};

module.exports.getFoods = async function (req, res) {
  try {
    // AWAITING FOR THE QUERY RESPONSE
    const features = new APIFeatures(Food.find(), req.query)
      .filter()
      .sorting()
      .limitingFields()
      .pagination();

    const foods = await features.query;

    res
      .status(200)
      .json({ status: "Success", length: foods.length, data: foods });
  } catch (err) {
    res.status(400).json({ status: "Unsuccessful", message: err });
  }
};

module.exports.addFood = async function (req, res) {
  try {
    await Food.create(req.body);
    res
      .status(200)
      .json({ status: "Successful", message: "Data created successful" });
  } catch (error) {
    res.status(404).json({ status: "Unsuccessful", message: error });
  }
};

module.exports.updateFood = async function (req, res) {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "Success", data: food });
  } catch (error) {
    res.status(400).json({ status: "unsuccessful", message: error });
  }
};

module.exports.deleteFood = async function (req, res) {
  try {
    // await Food.deleteOne({ _id: req.params.id });
    await Food.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "Success", message: "Food Got deleted." });
  } catch (error) {
    res.status(404).json({ status: "Unsuccessful", message: err.message });
  }
};

// NOTE: AGGREGATION PIPELINE - It is Framework that MongoDB provides us to transform a user sent data to some aggregated value step-by-step

module.exports.getFoodStats = async function (req, res) {
  try {
    const stats = await Food.aggregate([
      // STAGES WHERE DATA IS GOING TO PASS ONE-BY-ONE.
      { $match: { _price: { $gte: 100 } } },
      {
        $group: {
          _id: { $toUpper: "$_foodName" },
          numReviews: { $sum: 1 },
          avgRating: { $avg: "$_ratings" },
          avgPrice: { $avg: "$_price" },
          minPrice: { $min: "$_price" },
          maxPrice: { $max: "$_price" },
        },
      },
      {
        $sort: { avgRating: 1 },
      },
      // { $match: { _id: { $ne: "BEEF KABAB" } } },
    ]);

    res.status(200).json({ status: "Successful", data: stats });
  } catch (error) {
    res.status(404).json({ status: "Unsuccessful", message: error.message });
  }
};

module.exports.getResourceStats = async function (req, res) {
  try {
    const stats = await Food.aggregate([
      { $unwind: "$_ingredients" },
      {
        $group: {
          _id: "$_ingredients",
          foods: { $push: "$_foodName" },
        },
      },
      { $project: { _id: true, foods: true } },
    ]);
    res.status(200).json({ status: "Successful", data: stats });
  } catch (error) {
    res.status(404).json({ status: "Unsuccessful", message: error });
  }
};
