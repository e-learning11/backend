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
/**
 * sendMail
 * @param {Object} email
 */
async function sendMail(email) {
  try {
    let info = await transporter.sendMail(email);
  } catch (ex) {
    throw new Error(
      JSON.stringify({
        errors: [{ message: "cannot send email" }],
      })
    );
  }
}
module.exports = {
  transporter,
  sendMail,
};
