const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN_USERNAME,
    pass: process.env.SMTP_LOGIN_PASSWORD,
  },
});

async function sendMail(email) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.SENDING_MAIL, // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "reset your password", // plain text body
      html: "", // html body
    });
  } catch (ex) {
    throw new Error("cannot send email");
  }
}
module.exports = {
  transporter,
  sendMail,
};
