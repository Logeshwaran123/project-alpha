const dotenv = require("dotenv");

const fs = require("fs");
const mongoose = require("mongoose");
const Food = require("./../models/food-model.js");

dotenv.config({ path: "./config.env" });
// CONNECTION
const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN);
    console.log("Connection Successful 😃");
  } catch (err) {
    console.log(err);
    console.log("Connection Unsuccessful 🙄");
  }
};
connection();

const foods = JSON.parse(
  fs.readFileSync(`${__dirname}/foods.json`, "utf-8", (err, data) => {
    if (!err) {
      console.log("Data get readed");
    }
    return data;
  })
);
// IMPORT JSON DATA
const importData = async () => {
  try {
    await Food.create(foods);
    console.log("Data has been loaded to the DB");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE JSON DATA
const deleteData = async () => {
  try {
    await Food.deleteMany();
    console.log("Data has been deleted from the DB");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const opt = process.argv[2];
if (opt == "--import") {
  importData();
} else if (opt == "--delete") {
  deleteData();
}
