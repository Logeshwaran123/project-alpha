const express = require("express");
const morgan = require("morgan");
const roomRoute = require("./routes/room-route");
const userRoute = require("./routes/user-route");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/r", roomRoute);
app.use("/api/v1/u", userRoute);

module.exports = app;
