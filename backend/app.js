const express = require("express");
const morgan = require("morgan");
const roomRoute = require("./routes/room-route");
const userRoute = require("./routes/user-route");
const foodRoute = require("./routes/food-route");
const orderRoute = require("./routes/order-route");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/r", roomRoute);
app.use("/api/v1/u", userRoute);
app.use("/api/v1/f", foodRoute);
app.use("/api/v1/o", orderRoute);

module.exports = app;
