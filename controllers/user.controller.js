/**
 * This file contains logic to manipulate user resource
 */
const User = require("../models/user.model");

/**
 * Fetch the list of all Users
 *  - only ADMIN is allowed to call this method
 *  - ADMIN should be able to filter based on
 *    1. Name
 *    2. User Status
 *    3. User Type, etc
 */
const getAllUsers = async (req, res) => {
  try {
    /** query params */
    const { name, userType, userStatus } = req.query;

    const queryObj = {};
    /** add to queryObj if those query params are passed by user */
    if (name) {
      queryObj.name = name;
    }
    if (userType) {
      queryObj.userType = userType;
    }
    if (userStatus) {
      queryObj.userStatus = userStatus;
    }

    /** Fetch all the users from the DB */
    const users = await User.find(queryObj);

    let usersResponse = [];

    users.forEach((user) => {
      usersResponse.push({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        ticketsCreated: user.ticketsCreated,
        ticketsAssigned: user.ticketsAssigned,
      });
    });

    return res.status(200).json({
      success: true,
      users: usersResponse,
      count: users.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetch the user based on user id
 */
const getSingleUser = async (req, res) => {
  //get the userId from request parameters and fetch the user
  try {
    const user = await User.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `No user present with userid: ${req.params.userId}`,
      });
    }
    const userResObj = {
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
      ticketsCreated: user.ticketsCreated,
      ticketsAssigned: user.ticketsAssigned,
    };

    return res.status(200).json({
      success: true,
      user: userResObj,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ADMIN should be able to update the user - User status, User type
 *  Admin should provide - name, userStatus, userType in request body
 */
const updateUser = async (req, res) => {
  try {
    /** get the userId from req params */
    const userId = req.params.userId;
    const { name, userType, userStatus } = req.body;

    const user = await User.findOneAndUpdate(
      { userId },
      { name, userType, userStatus }
    ).exec();

    return res.status(200).json({
      success: true,
      message: `User record successfully updated`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
};
