const fs = require("fs");

const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));

module.exports.getAllUsers = function (req, res) {
  const users = JSON.parse(fs.readFileSync(`./dev-data/users.json`));
  res.status(200).json({ status: "Success", data: users });
};

module.exports.deleteAllUsers = function (req, res) {
  fs.writeFileSync(`./dev-data/users.json`, "[]");
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

module.exports.addUser = function (req, res) {
  const user = { _uid: req.userId, details: req.body };
  users.push(user);
  fs.writeFileSync(`./dev-data/users.json`, JSON.stringify(users));
  res.status(201).json({ status: "Success", message: "User Created" });
};

module.exports.updateUser = function (req, res) {
  // TODO: 1 Get the Particular User
  const user = users.find((cur) => cur._uid == req.params.id);
  // TODO: 2 Store the Requested Info from the Body which are need to be updated
  const reqData = req.body;
  const index = users.indexOf(user);

  if (!reqData.hasOwnProperty("_uid")) {
    // FOR OF LOOP [It is a loop condition over any object data and returns the values of the iterable.]
    for (const [key, value] of Object.entries(reqData)) {
      user[key] = value;
    }
    // TODO: 3 Add the Updated User info into the Users ARRAY
    users.splice(index, 1, user);
    fs.writeFileSync(`./dev-data/users.json`, JSON.stringify(users));
    res.status(200).json({ status: "Success", data: user });
  } else {
    res
      .status(400)
      .json({ status: "Unsuccessful", message: "User ID cannot be changed" });
  }
};
