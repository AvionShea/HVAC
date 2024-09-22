const express = require("express");
const router = express.Router();
const Appointment = require("../model/appointmentModels.js");
const path = require("path");
require("dotenv").config();

const {MailtrapTransport} = require("mailtrap");
const Nodemailer = require("nodemailer");

const TOKEN = process.env.MAIL_TOKEN;

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.com",
  name: "Heat Wave Warriors",
};

router.post("/schedule_service", async (req, res) => {
  const {name, email, phone, date} = req.body

  let scheduleEmailText = ` We've received your request to schedule an appointment for ${date}.
  
  We will give you a call at ${phone} to verify your service, date, and time.`

  try {
    const newAppointment = new Appointment({name, email, phone, date})
    await newAppointment.save()

    transport.sendMail({
    from: sender,
    to: email,
    subject: "HVAC Appointment Request",
    text: scheduleEmailText,
    category: "Appointment Request",
  })

    res.sendFile(path.join(__dirname,"../views/bookSuccess.html"))
  } catch (err) {
    console.log(err)
    res.sendFile(path.join(__dirname,"../views/bookError.html"))
  };
});

module.exports = router;