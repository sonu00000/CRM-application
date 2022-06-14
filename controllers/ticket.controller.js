const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const { userTypes, userStatuses } = require("../utils/constants");

/**
 * Create ticket
 *  - v1 Anyone should be able to create the ticket
 */

const createTicket = async (req, res) => {
  try {
    const ticketObj = {};
    ticketObj.title = req.body.title;
    ticketObj.description = req.body.description;
    ticketObj.priority = req.body.priority;

    const engUser = await User.findOne({
      userType: userTypes.engineer,
      userStatus: userStatuses.approved,
    });

    if (engUser) {
      ticketObj.assignedTo = engUser.userId;
    }

    const user = await User.findOne({ userId: req.userId });

    ticketObj.reportedBy = user.userId;

    const ticket = await Ticket.create(ticketObj);

    /**
     * After the ticket is created, update the user and engineer document to
     * include the recent ticket created and update the ticket assigned respectively
     *
     */
    if (ticket) {
      /** Update the user */
      user.ticketsCreated.push(ticket._id);
      await user.save();
      /** Update the engineer */
      engUser.ticketsAssigned.push(ticket._id);
      await engUser.save();
    }

    return res.status(201).json({ success: true, ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    /**
     * Get the user from DB who has requested the tickets, by getting userId from req object
     */
    const user = await User.findOne({ userId: req.userId });

    /** Query params */
    const { priority, status } = req.query;

    const queryObj = {};

    if (priority) {
      queryObj.priority = priority;
    }
    if (status) {
      queryObj.status = status;
    }
    let tickets = null;
    if (user.userType === userTypes.admin) {
      // Fetch all tickets if user is admin
      tickets = await Ticket.find(queryObj);
    } else if (user.userType === userTypes.engineer) {
      //if engineer, get all the tickets created by him ond all the tikcets assigned to him
      tickets = await Ticket.find({
        $or: [{ reportedBy: user.userId }, { assignedTo: user.userId }],
        ...queryObj,
      });
    } else {
      // If customer, get only the tickets created that user
      //tickets = await Ticket.find({ reportedBy: user.userId, ...queryObj });
      tickets = await Ticket.find({ reportedBy: user.userId, ...queryObj });
    }

    return res.status(200).json({ tickets, count: tickets.length });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.find({ _id: req.params.id });
    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    //Check if the ticket exists
    const ticket = await Ticket.findOne({ _id: req.params.id });

    if (!ticket) {
      return res
        .status(200)
        .json({ success: true, msg: `Ticket doesn't exist` });
    }

    /** if the requestor has also created the ticket, then allow updation */
    const user = await User.findOne({ userId: req.userId });

    if (
      !user.ticketsCreated.includes(ticket._id) &&
      !(user.userType === userTypes.admin) &&
      !(ticket.assignedTo === user.userId)
    ) {
      return res.status(403).json({
        success: false,
        msg: `Only the ticket owner, the engineer that the ticket is currently assigned to and admin are allowed to update this ticket`,
      });
    }

    // Update the attributes of the ticket
    const { title, description, priority, status, assignedTo } = req.body;
    if (title) {
      ticket.title = title;
    }
    if (description) {
      ticket.description = description;
    }
    if (priority) {
      ticket.priority = priority;
    }
    if (status) {
      ticket.status = status;
    }

    if (assignedTo && user.userType !== userTypes.customer) {
      // Get the user from DB to whom the requestor is trying to assign the ticket to
      const assignedToUser = await User.findOne({ userId: assignedTo });

      // If the ''assignedToUser' is not an angineer and if an engineer, check whether it a verified engineeer account
      if (
        assignedToUser.userType !== userTypes.engineer ||
        assignedToUser.userStatus !== userStatuses.approved
      ) {
        return res.status(400).json({
          success: false,
          msg: `You can only assign ticket to an approved engineer only`,
        });
      }
      /**
       * Allow admin and engineer to reassign or assign the ticket to another engineer
       */
      if (
        user.userType === userTypes.admin ||
        user.userType === userTypes.engineer
      ) {
        ticket.assignedTo = assignedTo;
      }
    }

    const updatedTicket = await ticket.save();

    return res.status(200).json({ success: true, ticket: updatedTicket });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
};
