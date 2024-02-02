require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const booking_routes = require("./routes/booking-routes");
const user_routes = require("./routes/user-routes");
const review_routes = require("./routes/review-routes");
const cors = require("cors");

const { verifyUser } = require("./middlewares/auth");

const port = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`connected to mongodb database server ${MONGODB_URI}`);
  })
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Node");
});

app.use("/users", user_routes);

app.use("/booking", verifyUser, booking_routes);

app.use("/reviews", verifyUser, review_routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") res.status(400);
  else if (err.name === "CastError") res.status(400);
  res.json({ error: err.message });
});

// Unknown Path
app.use((req, res) => {
  res.status(404).json({ error: "Path Not Found" });
});

module.exports = app;
