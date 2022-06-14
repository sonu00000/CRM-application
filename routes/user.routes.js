const {
  getAllUsers,
  getSingleUser,
  updateUser,
} = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authjwt");

router.route("/").get([verifyToken, isAdmin], getAllUsers);
router.route("/:userId").get([verifyToken], getSingleUser);
router.route("/:userId").put([verifyToken, isAdmin], updateUser);

module.exports = router;
