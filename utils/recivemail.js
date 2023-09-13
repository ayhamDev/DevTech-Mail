const SendMail = require("./sendmail");
const Imap = require("node-imap");
require("dotenv").config();

var imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: "imap.titan.email",
  port: 993,
  tls: true,
});
function openInbox() {
  imap.openBox("INBOX", false, (err, box) => {
    if (err) throw err;
    MailHandler(box);
  });
}
function MailHandler() {
  imap.search(["UNSEEN"], function (err, results) {
    if (results.length == 0 || err) return null;
    var f = imap.fetch(results, { bodies: "", markSeen: true });
    f.on("message", function (msg, seqno) {
      console.log("Message #%d", seqno);
      var prefix = "(#" + seqno + ") ";
      msg.on("body", function (stream, info) {
        var buffer = "",
          count = 0;
        stream.on("data", function (chunk) {
          count += chunk.length;
          buffer += chunk.toString("utf8");
        });
        stream.once("end", function () {
          let headers = Imap.parseHeader(buffer);
          const emailTo = headers.from[0].split(/<|>/)[1];
          if (emailTo == process.env.SMTP_WEBSITE_USER) return null;

          SendMail(emailTo)
            .then((data) => {
              console.log(data);
            })
            .catch((err) => console.log(err));
        });
      });
      msg.once("end", function () {
        console.log(prefix + "Finished");
      });
    });
    f.once("error", function (err) {
      console.log("Fetch error: " + err);
    });
    f.once("end", function () {
      console.log("Done fetching all messages!");
    });
    f.once("error", function (err) {
      console.log("Fetch error: " + err);
    });
    f.once("end", function () {
      console.log("Done fetching all messages!");
    });
  });
}
imap.on("mail", () => {
  console.log("new Mail...");
  MailHandler();
});
imap.once("ready", function () {
  console.log("Connected To Imap");
  openInbox();
});

imap.once("error", function (err) {
  console.log(err);
});

imap.once("end", function () {
  console.log("Connection ended");
});
function ImapConnect() {
  return imap.connect();
}
module.exports = ImapConnect;
