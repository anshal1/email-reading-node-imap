const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const ApiError = require('./ApiError');

// Function to get the name of mailboxes like Inbox, Sent, All Mail etc, this function is required because every mail has different mail box name
// eslint-disable-next-line
const GetMailBoxNames = (imap) => {
  return new Promise((resolve, reject) => {
    imap.getBoxes((err, boxes) => {
      if (err) {
        reject(err);
      } else {
        resolve(boxes);
      }
    });
  });
};

const ConnectToIMAP = (config) => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);
    imap.once('ready', () => {
      resolve(imap);
    });
    imap.once('error', (err) => {
      reject(err);
    });
    imap.connect();
  });
};

const OpenmailBox = (imap, mailboxName) => {
  return new Promise((resolve, reject) => {
    imap.openBox(mailboxName, true, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const SearchMail = (searchParams, imap) => {
  return new Promise((resolve, reject) => {
    imap.search(searchParams, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.reverse());
      }
    });
  });
};

const ParseMessage = (imap, limit) => {
  return new Promise((resolve, reject) => {
    let mails = [];
    const messages = imap.fetch(limit, { bodies: '' });
    messages.on('message', (msg) => {
      msg.on('body', (stream) => {
        simpleParser(stream, async (err, parsed) => {
          if (err) {
            throw new ApiError(500, err);
          }
          mails.push(parsed);
        });
      });
    });
    messages.once('error', (ex) => {
      Promise.reject(ex);
      reject(new Error('Something went wrong'));
    });
    messages.once('end', () => {
      console.log('All Messages Fetched'); // eslint-disable-line
      imap.end();
    });
    imap.once('end', () => {
      console.log('Connection Successfully Ended'); // eslint-disable-line
      resolve(mails);
    });
  });
};

const Paginate = (page, limit) => {
  const paginate = {
    startIdx: 0,
    endIdx: 0,
  };
  paginate.startIdx = (+page - 1) * +limit;
  paginate.endIdx = +limit * +page;
  return paginate;
};

module.exports = {
  GetMailBoxNames,
  ConnectToIMAP,
  OpenmailBox,
  SearchMail,
  ParseMessage,
  Paginate,
};
