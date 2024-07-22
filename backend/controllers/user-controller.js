const fs = require("fs");

const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));

module.exports.getAllUsers = function (req, res) {
  const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));
  res.status(200).json({ status: "Success", data: users });
};

module.exports.deleteAllUsers = function (req, res) {
  const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));
  res.status(204).json({ status: "Success", message: "All Users Deleted" });
};

// GET DELETE UPDATE CREATE - USERS Route
module.exports.getUser = function (req, res) {
  const user = users.find((cur) => cur._uid == req.params.id);
  res.status(200).json({ status: "Success", data: user });
};

module.exports.deleteUser = function (req, res) {
  const user = users.find((cur) => cur._uid == req.params.id);
  users.splice(users.indexOf(user), 1);
  fs.writeFileSync(`./dev-data/users.json`, JSON.stringify(users));
  res.status(200).json({ status: "Success", message: "User deleted" });
};

// ---- UPDATED USER
module.exports.updateUser = function (req, res) {
  const user = users.find((cur) => cur._uid == req.params.id);
  const reqData = req.body;
  if (reqData.hasOwnProperty("_uid")) {
    res
      .status(400)
      .json({ status: "Unsuccessful", message: "ID cannot be changed" });
  } else {
    const ind = users.indexOf(user);
    for (const [key, value] of Object.entries(req.body)) {
      user[key] = value;
    }
    users.splice(ind, 1, user);
    console.log(users);
    fs.writeFileSync("./dev-data/users.json", JSON.stringify(users));
    res.status(200).json({ status: "Success", data: user });
  }
};
