/*
Functions of this page:-
1. To export a function that sends e-mail
*/

const nodemailer = require("nodemailer")


const sendEmail = async (email, subject, text, attachment = false, attachments = []) => {
  try {
    console.log(process.env.HOST)
    const transporter = nodemailer.createTransport({
      service: 'smtp.zoho.in',
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
    })

    if (Array.isArray(email)) {
      email = email.join(',')
    }

    if (attachment) {
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text,
        attachments: attachments
      })
    } else {
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text
      })
    }

    console.log("email sent sucessfully")
    return 1
  } catch (error) {
    console.log(error, "email not sent")
    return 0
  }
}

module.exports = sendEmail