const express = require("express");
const roomRoute = express.Router();
const roomControllers = require("../controllers/room-controllers");
const fs = require("fs");
const rooms = JSON.parse(fs.readFileSync("./dev-data/rooms.json"));

roomRoute
  .route("/rooms")
  .get((req, res) => roomControllers.getAllRooms(req, res))
  .delete((req, res) => roomControllers.deleteAllRooms(req, res));

roomRoute.use((req, res, next) => {
  req.roomId = `R0${rooms.length + 1}`;
  next();
});

roomRoute
  .route("/room")
  .post((req, res) => roomControllers.addOneRoom(req, res));

roomRoute
  .route("/room/:no")
  .get((req, res) => roomControllers.getOneRoom(req, res))
  .delete((req, res) => roomControllers.deleteOneRoom(req, res));

module.exports = roomRoute;
