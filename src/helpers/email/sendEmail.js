const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const defaultMailOptions = {
  from: process.env.EMAIL,
  to: 'bigbeng41@gmail.com',
  subject: 'Hello ✔',
  text: 'Hello world ?',
};

function sendMail(emailOptions) {
  transporter.sendMail({ ...defaultMailOptions, ...emailOptions }, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

module.exports = { sendMail };
