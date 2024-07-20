const express = require("express");
const roomRoute = express.Router();
const roomControllers = require("../controllers/room-controllers");

roomRoute
  .route("/rooms")
  .get((req, res) => roomControllers.getAllRooms(req, res))
  .delete((req, res) => roomControllers.deleteAllRooms(req, res));

roomRoute
  .route("/room")
  .post((req, res) => roomControllers.addOneRoom(req, res));

roomRoute
  .route("/room/:no")
  .get((req, res) => roomControllers.getOneRoom(req, res))
  .delete((req, res) => roomControllers.deleteOneRoom(req, res));

module.exports = roomRoute;
