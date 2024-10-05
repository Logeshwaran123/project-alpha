const foodController = require("../controllers/food-controllers.js");
const express = require("express");
const foodRoute = express.Router();

foodRoute
  .route("/foods/top-sellers")
  // sort=_price,_ratings&field=_foodName,_price,_ratings,_cookingTIme
  .get(
    (req, res, next) => foodController.topSellers(req, res, next),
    (req, res) => foodController.getFoods(req, res)
  );

foodRoute
  .route("/foods/getFoodStats")
  .get((req, res) => foodController.getFoodStats(req, res));

foodRoute
  .route("/foods/getResourceStats")
  .get((req, res) => foodController.getResourceStats(req, res));

foodRoute.route("/foods").get((req, res) => foodController.getFoods(req, res));
foodRoute
  .route("/food")
  .post((req, res) => foodController.addFood(req, res))
  .delete((req, res) => foodController.deleteFood(req, res));

foodRoute
  .route("/food/:id")
  .get((req, res) => foodController.getFood(req, res))
  .patch((req, res) => foodController.updateFood(req, res))
  .delete((req, res) => foodController.deleteFood(req, res));

module.exports = foodRoute;
