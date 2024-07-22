const express = require("express");
const userRoute = express.Router();
const userControllers = require("../controllers/user-controller");

userRoute
  .route("/users")
  .get((req, res) => userControllers.getAllUsers(req, res))
  .delete((req, res) => userControllers.deleteAllUsers(req, res));

userRoute
  .route("/user/:id")
  .get((req, res) => userControllers.getUser(req, res))
  .delete((req, res) => userControllers.deleteUser(req, res))
  .patch((req, res) => userControllers.updateUser(req, res));

module.exports = userRoute;
