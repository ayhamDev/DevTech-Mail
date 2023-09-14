require("dotenv").config();
const express = require("express");
const app = express();
const ImapConnect = require("./utils/recivemail");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const SendMail = require("./utils/sendmail.website");
const moment = require("moment/moment");

const PORT = process.env.PORT || 4200;

app.use(cors());
app.use(express.json());
app.get("/ping", (req, res) => {
  const data = {
    request_uuid: crypto.randomUUID(),
    ip: req.ip,
    date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
  };
  res.status(200).json(data);
  console.log(data);
});
app.post(
  "/",
  body("name").isString(),
  body("company").isString().optional(),
  body("email").isEmail(),
  body("phone").isString(),
  body("subject").isString(),
  body("message").isString(),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json(result.array());
    SendMail(process.env.IMAP_USER, req.body.email, req.body)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
);
app.listen(PORT, () => {
  ImapConnect();
  console.log("Mailing API Is Running on Port:", PORT);
});
