// For getting all sent emails

const express = require("express");
const app = express();
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const Mails = [];

// for sent email
// const startDate = new Date("2023-08-01");
// const endDate = new Date("2023-11-31");
// [
//     ["SENTSINCE", startDate.toISOString()],
//     ["BEFORE", endDate.toISOString()],
//   ],

const imapConfig = {
  user: "ritwik@aican.co.in",
  password: "Ai.can.co.in",
  host: "imap.secureserver.net",
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
      imap.openBox("INBOX", false, () => {
        imap.search(["ALL"], (err, results) => {
          if (results.length === 0) {
            console.log("No mails to fetch");
            imap.end();
            return;
          }
          const limit = results.slice(0, 10);
          const f = imap.fetch(limit, { bodies: "" });
          f.on("message", (msg) => {
            msg.on("body", (stream) => {
              simpleParser(stream, async (err, parsed) => {
                // const {from, subject, textAsHtml, text} = parsed;
                console.log(parsed);
                Mails.push(parsed);
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
            console.log(Mails.length);
            imap.end();
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.log(err);
    });

    imap.once("end", () => {
      console.log(Mails.length);
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
