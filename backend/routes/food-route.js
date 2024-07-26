const foodController = require("../controllers/food-controllers.js");
const express = require("express");
const foodRoute = express.Router();

const fs = require("fs");
const foods = JSON.parse(fs.readFileSync(`./dev-data/foods.json`));

foodRoute.route("/foods").get((req, res) => foodController.getFoods(req, res));

foodRoute.use((req, res, next) => {
  req.foodId = `F0${foods.length + 1}`;
  next();
});

foodRoute.route("/food").post((req, res) => foodController.addFood(req, res));

foodRoute
  .route("/food/:id")
  .get((req, res) => foodController.getFood(req, res))
  .patch((req, res) => foodController.updateFood(req, res));

module.exports = foodRoute;
