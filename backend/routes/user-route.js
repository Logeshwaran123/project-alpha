const express = require("express");
const userRoute = express.Router();
const userControllers = require("../controllers/user-controller");

const fs = require("fs");
const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));

userRoute
  .route("/users")
  .get((req, res) => userControllers.getAllUsers(req, res))
  .delete((req, res) => userControllers.deleteAllUsers(req, res));

userRoute.use((req, res, next) => {
  req.userId = `U0${users.length + 1}`;
  next();
});

userRoute.route("/user").post((req, res) => userControllers.addUser(req, res));

userRoute
  .route("/user/:id")
  .get((req, res) => userControllers.getUser(req, res))
  .delete((req, res) => userControllers.deleteUser(req, res))
  .patch((req, res) => userControllers.updateUser(req, res));

module.exports = userRoute;
