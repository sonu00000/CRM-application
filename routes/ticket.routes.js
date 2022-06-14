const {
  createTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
} = require("../controllers/ticket.controller");
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authjwt");

router
  .route("/")
  .post(verifyToken, createTicket)
  .get(verifyToken, getAllTickets);
router
  .route("/:id")
  .get(verifyToken, getSingleTicket)
  .put(verifyToken, updateTicket);

module.exports = router;
