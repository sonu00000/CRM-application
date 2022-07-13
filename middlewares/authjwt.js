/**
 * Authentication
 *  - If the token passed is valid or not
 *
 * 1. If token is not passed in the request header - Not Allowed
 * 2. If token is passed, authenticate the user.
 *    - if correct allow, else reject
 */

const jwt = require("jsonwebtoken");
const { secret } = require("../configs/auth.config");
const User = require("../models/user.model");
const { userTypes, userStatuses } = require("../utils/constants");

const verifyToken = (req, res, next) => {
  /**
   * Read the token from user
   */
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided",
    });
  }

  //Verify the token
  try {
    //get the payload
    const decoded = jwt.verify(token, secret);
    //read the userId from the decoded token, and add it to request object
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

/**
 * Check if the passed access token is of admin or not
 */

const isAdmin = async (req, res, next) => {
  try {
    /**
     * Fetch user from the from DB using userId from the request obj
     */
    const user = await User.findOne({ userId: req.userId });

    /**
     * Check the user type
     */
    if (user && user.userType === userTypes.admin) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Requires ADMIN role",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
