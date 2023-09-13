require("dotenv").config();
const { createTransport } = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs");
let transporter = createTransport({
  host: "smtp.titan.email", // <= your smtp server here
  auth: {
    user: process.env.SMTP_USER, // <= smtp login user
    pass: process.env.SMTP_PASS, // <= smtp login pass
  },
  secure: true,
  port: 465,
});
//attach the plugin to the nodemailer transporter

let mailOptions = {
  from: `${process.env.SMTP_FROM} <${process.env.SMTP_USER}>`,
  subject: "Thank You For Conacting Us", // <= email subject ex. 'Test email'
};
const SendMail = (To = "", context) => {
  const data = fs.readFileSync("./mizzle/email/Autoreply.handlebars", {
    encoding: "utf-8",
  });

  const template = Handlebars.compile(data);
  return transporter.sendMail({
    to: To,
    html: template(context),
    ...mailOptions,
  });
};

module.exports = SendMail;
