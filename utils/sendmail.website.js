const { createTransport } = require("nodemailer");
require("dotenv").config();
const SendAutoReply = require("./sendmail");
const { response } = require("express");
let transporter = createTransport({
  host: "smtp.titan.email", // <= your smtp server here
  auth: {
    user: process.env.SMTP_WEBSITE_USER, // <= smtp login user
    pass: process.env.SMTP_WEBSITE_PASS, // <= smtp login pass
  },
  secure: true,
  port: 465,
});
let mailOptions = {
  from: `${process.env.SMTP_WEBSITE_FROM} <${process.env.SMTP_WEBSITE_USER}>`, // <= should be verified and accepted by service provider. ex.
  subject: "customer", // <= email subject ex. 'Test email'
  text: "thank you for contacting with us, we will come back to you soon.", // <= for plain text emails. ex. 'Hello world'
};
const SendMail = (To = "", AutoReplyTo = "") => {
  return new Promise((resovle, reject) => {
    transporter
      .sendMail({
        to: To,
        ...mailOptions,
      })
      .then((data) => {
        console.log(data);
        SendAutoReply(AutoReplyTo)
          .then((data) => {
            resovle(data);
          })
          .catch((err) => {
            reject({
              type: 2,
              reason: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        reject({
          type: 1,
          reason: err,
        });
      });
  });
};

module.exports = SendMail;
