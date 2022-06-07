const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    reuired: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 10,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
  userType: {
    type: String,
    default: "CUSTOMER",
  },
  userStatus: {
    type: String,
    default: "APPROVED",
  },
});
