const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
