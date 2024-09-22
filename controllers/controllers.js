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

//Controller for Schedule Service
exports.scheduleService = async (req, res) => {
  const {name, email, phone, date} = req.body;

  let scheduleEmailText = ` Hi ${name},
  
  We've received your request to schedule an appointment for ${date}.
  
  We will give you a call at ${phone} to verify your service, date, and time.
  
  Sincerely,
  
  Heat Wave Warriors Team`;

  try {
    const newAppointment = new Appointment({name, email, phone, date});
    await newAppointment.save();

    await transport.sendMail({
    from: sender,
    to: email,
    subject: "HVAC Appointment Request",
    text: scheduleEmailText,
    category: "Appointment Request",
  });

    res.sendFile(path.join(__dirname,"../views/bookSuccess.html"))
  } catch (err) {
    console.log(err)
    res.sendFile(path.join(__dirname,"../views/bookError.html"))
  };
};

//Controller for Request Quote
exports.requestQuote = async (req, res) => {
  const {name, email, service, message} = req.body

  let quoteEmailText = `Hi ${name},

  Thank you for reaching out to request a quote for your ${service} needs! One of our knowledgeable reps will email you at ${email} within one business day to hear more about how we can better assist you.
  
  For your records, your message to us is below:
  
  ${message}
  
  
  Sincerely,

  Heat Wave Warriors Team`;

  try {
    transport.sendMail({
    from: sender,
    to: email,
    subject: "HVAC Quote Request",
    text: quoteEmailText,
    category: "Quote Request",
  })

    res.sendFile(path.join(__dirname,"../views/bookSuccess.html"))
  } catch (err) {
    console.log(err)
    res.sendFile(path.join(__dirname,"../views/bookError.html"))
  };
};