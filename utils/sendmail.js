const { createTransport } = require("nodemailer");
require("dotenv").config();

let transporter = createTransport({
  host: "smtp.titan.email", // <= your smtp server here
  auth: {
    user: process.env.SMTP_USER, // <= smtp login user
    pass: process.env.SMTP_PASS, // <= smtp login pass
  },
  secure: true,
  port: 465,
});
let mailOptions = {
  from: `${process.env.SMTP_FROM} <${process.env.SMTP_USER}>`, // <= should be verified and accepted by service provider. ex.
  subject: "This is auto reply", // <= email subject ex. 'Test email'
  text: "thank you for contacting with us, we will come back to you soon.", // <= for plain text emails. ex. 'Hello world'
};
const SendMail = (To = "") => {
  return transporter.sendMail({
    to: To,
    ...mailOptions,
  });
};

module.exports = SendMail;
