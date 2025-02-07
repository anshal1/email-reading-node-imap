// For getting all sent emails

const express = require("express");
const cors = require("cors");
const app = express();
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
app.use(
  cors({
    origin: "*",
  })
);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const imapConfig = {
  user: "emil",
  password: "password",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  authTimeout: 30000,
  connTimeout: 30000,
};
const imap = new Imap(imapConfig);
const mails = [];
const getEmails = () => {
  try {
    imap.once("ready", () => {
      //   imap.getBoxes((err, boxes) => {
      //     console.log(boxes);
      //     imap.end();
      //   });
      //   return;
      imap.openBox("[Gmail]/All Mail", false, () => {
        imap.search(["ALL"], (err, results) => {
          if (results.length === 0) {
            console.log("No mails to fetch");
            imap.end();
            return;
          }
          const reverse = results.reverse();
          const limit = reverse.slice(0, 5);
          const f = imap.fetch(limit, { bodies: "" });
          f.on("message", (msg) => {
            msg.on("body", (stream) => {
              simpleParser(stream, async (err, parsed) => {
                // const {from, subject, textAsHtml, text} = parsed;
                mails.push(parsed);
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
        });
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

app.get("/", (req, res) => {
  res.send(mails);
});

app.listen(9000, () => {
  console.log("APP RUNNING");
});
