const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { userTypes, userStatuses } = require("../utils/constants");
const jwt = require("jsonwebtoken");
const { secret } = require("../configs/auth.config");
/**
 * Controller for signup/ registration
 */
const signup = async (req, res) => {
  const { name, userId, email, password, userType, userStatus } = req.body;

  const userObj = {
    name: name,
    userId: userId,
    email: email,
    password: bcrypt.hashSync(password, 8),
  };

  if (userStatus !== "undefined") {
    userObj.userStatus = userStatus;
  }

  if (userType !== "undefined") {
    userObj.userType = userType;
    if (userType !== userTypes.customer) {
      userObj.userStatus = userStatuses.pending;
    }
  }

  try {
    const user = await User.create(userObj);
    const userResponse = {
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(201).json({ success: true, user: userResponse });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
      return res.status(400).json({ message: "Failed! User Id doesnot exist" });
    }

    //if user exists, check whether user is approved
    if (user.userStatus != userStatuses.approved) {
      return res.status(200).json({
        succes: false,
        message: "Not allowed to login, as the user is stil not approved",
      });
    }
    //validate the user password
    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ succes: false, message: "Invalid credentials" });
    }
    /** on successful login (correct password), generate access token */
    const token = jwt.sign({ id: user.userId }, secret, { expiresIn: "1d" });

    const userResObj = {
      accessToken: token,
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(200).json({ success: true, user: userResObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  signin,
};
