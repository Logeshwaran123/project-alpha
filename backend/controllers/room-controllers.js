const fs = require("fs");
const rooms = JSON.parse(fs.readFileSync("./dev-data/rooms.json"));

module.exports.getAllRooms = function (req, res) {
  const rooms = JSON.parse(fs.readFileSync("./dev-data/rooms.json"));
  res.status(200).json({ status: "Success", data: rooms });
};

module.exports.deleteAllRooms = function (req, res) {
  fs.writeFileSync("./dev-data/rooms.json", "[]");
  res
    .status(204)
    .json({ status: "Success", message: "All data has been deleted" });
};

module.exports.addOneRoom = function (req, res) {
  const room = { _room_no: req.roomId, details: req.body };

  rooms.push(room);

  fs.writeFileSync("./dev-data/rooms.json", JSON.stringify(rooms), (err) => {
    if (err)
      res.status(400).json({ status: "Invalid Request", message: err.message });
  });

  res.status(201).json({
    status: "Success",
    message: "Data has been created",
    data: room,
  });
};

module.exports.getOneRoom = function (req, res) {
  const room = rooms.find((cur) => cur._room_no == req.params.no);
  res.status(200).json({ status: "Success", data: room });
};

module.exports.deleteOneRoom = function (req, res) {
  console.log(req.params);

  const room = rooms.find((cur) => cur._room_no == req.params.no);
  console.log(room);

  rooms.splice(rooms.indexOf(room), 1);

  fs.writeFileSync("./dev-data/rooms.json", JSON.stringify(rooms));

  res.status(204).json({ status: "Success", message: "Data has been deleted" });
};
