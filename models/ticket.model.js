/**
 * This file represents schema for ticket
 */

const mongoose = require("mongoose");
const { ticketStatus, ticketPriority } = require("../utils/constants");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    default: ticketPriority.four, // Possible values can be 1/2/3/4
  },
  status: {
    type: String,
    required: true,
    default: ticketStatus.open, //Possible values - "OPEN/CLOSED/BLOCKED"
  },
  reportedBy: {
    type: String,
  },
  assignedTo: {
    type: String,
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
});

module.exports = mongoose.model("Ticket", ticketSchema);
