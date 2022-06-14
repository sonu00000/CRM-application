const express = require("express");
const mongoose = require("mongoose");
const { PORT } = require("./configs/server.config");
const { DB_URL } = require("./configs/db.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("./models/user.model");

const app = express();

//pasrse the JSON request into JS objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const ticketRouter = require("./routes/ticket.routes");

app.use("/crm/api/v1/auth", authRouter);
app.use("/crm/api/v1/users", userRouter);
app.use("/crm/api/v1/tickets", ticketRouter);

/**
 * Connect to DB and Start the express server
 */

const init = async () => {
  //check if admin user already created in DB
  const user = await User.findOne({ userId: "admin" });

  if (user) {
    return;
  } else {
    //Create the admin user
    try {
      const user = await User.create({
        name: "Don",
        userId: "admin",
        email: "don@gmail.com",
        userType: "ADMIN",
        password: bcrypt.hashSync("adminSecret", 8),
      });
      console.log("Admin user is created");
    } catch (error) {
      console.log(error);
    }
  }
};

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
    //create an ADMIN user if not present on start up after connected to DB
    init();
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}..`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
