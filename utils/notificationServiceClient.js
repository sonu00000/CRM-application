/***
 * Logic to make POST call to the notificationservice
 */
const Client = require("node-rest-client").Client;
const client = new Client();
const { notificationSvcURL } = require("../configs/notificationsvcURL.config");

/**
 * Expose a function which will take the following information -
 *    subject, ticketId, content, recipientEmails, requestor
 * And make a POST call
 */

const triggerNotificationService = (
  subject,
  ticketId,
  content,
  recipientEmails,
  requestor
) => {
  const reqBody = { subject, ticketId, content, recipientEmails, requestor };
  const headers = {
    "Content-Type": "application/json",
  };

  const args = { data: reqBody, headers };

  const req = client.post(notificationSvcURL, args, (data, response) => {
    console.log("Notification POST Request successfully sent");
    console.log(data);
    console.log(response);
  });

  /**
   * Check for Errors
   */

  /** Event handlers for handing different types of errors if occured */
  req.on("requestTimeout", function (req) {
    console.log("request has expired");
    req.abort();
  });

  req.on("responseTimeout", function (res) {
    console.log("response has expired");
  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
  req.on("error", function (err) {
    console.log("request error", err);
  });
};

module.exports = triggerNotificationService;
