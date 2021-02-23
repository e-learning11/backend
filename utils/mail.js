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

async function sendMail(email, token) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.SENDING_MAIL, // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: `Reset your password with this token:\n ${token}
      please note that the token is valid for only 5 hours`, // plain text body
      html: `<p>Reset your password with this token:\n <b>${token}</b>
      <p>please note that the token is valid for only <b>5</b> hours</p>`, // html body
    });
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
