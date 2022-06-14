/**
 * Custom middleware for verifying request body
 */
const User = require("../models/user.model");

const validateSignupRequest = async (req, res) => {
  /**
   * Validate if mandatory user fields are passed during signup
   */
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.userId
  ) {
    return res.status(400).json({
      success: false,
      message: `All the user fields which includes name, email, password, and user id must be provided`,
    });
  }

  /**
   * Check whether userId provided already exists in Db
   */
  const user = await User.findOne({ userId: req.body.userId });

  if (user) {
    return res.status(400).json({
      success: false,
      message: `User Id provided already exists!!`,
    });
  }

  next();
};

module.exports = {
  validateSignupRequest,
};
