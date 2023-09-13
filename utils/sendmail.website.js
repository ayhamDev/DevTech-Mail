const { createTransport } = require("nodemailer");
require("dotenv").config();
const SendAutoReply = require("./sendmail");
const Handlebars = require("handlebars");
const fs = require("fs");

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
};
const SendMail = (To = "", AutoReplyTo = "", reqBody) => {
  return new Promise((resovle, reject) => {
    const data = fs.readFileSync("./mizzle/email/ClientInfo.handlebars", {
      encoding: "utf-8",
    });
    const Mail_UUID = crypto.randomUUID();
    const template = Handlebars.compile(data);
    transporter
      .sendMail({
        to: To,
        subject: reqBody.name,
        html: template({
          name: reqBody.name,
          company: reqBody.company,
          email: reqBody.email,
          phone: reqBody.phone,
          subject: reqBody.subject,
          message: reqBody.message,
          UUID: Mail_UUID,
        }),
        ...mailOptions,
      })
      .then((data) => {
        console.log(data);
        SendAutoReply(AutoReplyTo, {
          name: reqBody.name,
        })
          .then((data) => {
            resovle({ data, Mail_UUID });
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
