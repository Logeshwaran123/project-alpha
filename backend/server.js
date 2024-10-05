const server = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

// CONNECTION
const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN);
    console.log("Connection Successful 😃");
  } catch {
    console.log("Connection Unsuccessful 🙄");
  }
};
connection();

server.listen(8000, () => {
  console.log("Server is listening on PORT 8000.");
});
