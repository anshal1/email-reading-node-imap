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

const imapConfig = {
  user: "anshalpatel6@gmail.com",
  password: "oejoevlbhohxbwdc",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  authTimeout: 30000,
  connTimeout: 30000,
};
const imap = new Imap(imapConfig);
const mails = [];

function OpenmailBox(boxname) {
  return new Promise((resolve, reject) => {
    try {
      imap.openBox(boxname, true, () => {
        imap.search(["ALL"], (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(result);
          resolve(result);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

app.get("/", async (req, res) => {
  try {
    imap.once("ready", async () => {
      console.log("running1");
      const box = await OpenmailBox("[Gmail]/All Mail");
      console.log("running");
      console.log(box, "BOX");
    });
    // const f = imap.fetch(5, { bodies: "" });
    // f.on("message", (msg) => {
    //   msg.on("body", (stream) => {
    //     simpleParser(stream, async (err, parsed) => {
    //       // const {from, subject, textAsHtml, text} = parsed;
    //       console.log(parsed);
    //     });
    //   });
    // });
    imap.connect();
    imap.end();
  } catch (ex) {
    console.log(ex);
    console.log("an error occurred");
  }
});

app.listen(5000, () => {
  console.log("App Running");
});
