import nodemailer from "nodemailer"
import config from "./index"
 // create reusable transporter object using the default SMTP transport
 let transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.SMTP_MAIL_USERNAME, // generated ethereal user
      pass: config.SMTP_MAIL_PASSWORD, // generated ethereal password
    },
  });

  export default transporter

//   now we can create a mail utility which will help us to send email