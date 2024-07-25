const express = require("express");
const app = express();
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const imapConfig = {
  user: "anshalpatel6@gmail.com",
  password: "oejo evlb hohx bwdc",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  authTimeout: 30000,
  connTimeout: 30000,
};
const imap = new Imap(imapConfig);

const getEmails = () => {
  try {
    imap.once("ready", () => {
      //   imap.getBoxes((err, boxes) => {
      //     console.log(boxes);
      //     imap.end();
      //     return;
      //   });
      imap.openBox("[Gmail]/Sent Mail", false, () => {
        imap.search(
          ["ALL", ["SENTSINCE", "January 20, 2023"]],
          (err, results) => {
            const f = imap.fetch(results, { bodies: "" });
            f.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  // const {from, subject, textAsHtml, text} = parsed;
                  console.log(parsed);
                  /* Make API call to save the data
                     Save the retrieved data into a database.
                     E.t.c
                  */
                });
              });
              // msg.once("attributes", (attrs) => {
              //   const { uid } = attrs;
              //   imap.addFlags(uid, ["\\Seen"], () => {
              //     // Mark the email as read after reading it
              //     console.log("Marked as read!");
              //   });
              // });
            });
            f.once("error", (ex) => {
              return Promise.reject(ex);
            });
            f.once("end", () => {
              console.log("Done fetching all messages!");
              imap.end();
            });
          }
        );
      });
    });

    imap.once("error", (err) => {
      console.log(err);
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (ex) {
    console.log("an error occurred");
  }
};
getEmails();

app.listen(5000, () => {
  console.log("APP RUNNING");
});
