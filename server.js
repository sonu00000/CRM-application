const express = require("express");
const mongoose = require("mongoose");
const { PORT } = require("./configs/server.config");
const { DB_URL } = require("./configs/db.config");

const app = express();

/**
 * Connect to DB and Start the express server
 */

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}..`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
