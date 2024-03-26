require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "anshinfotech1@gmail.com",
    pass: "xbgddxncrtdjbbub",
  },
});


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// Connect to MongoDB (replace 'your-mongodb-uri' with your MongoDB URI)

const DB = async () => {
  try {
    await mongoose.connect("mongodb+srv://AIT:AIT@cluster0.tznmaxa.mongodb.net/");
    console.log("databse connected");
  } catch (error) {
    console.log(error);
  }
};

DB();
// Create a mongoose schema for registration
const registrationSchema = new mongoose.Schema(
  {
    name: String,
    father_Name: String,
    mother_Name: String,
    contactNumber: String,
    alternateContactNumber: String,
    email: String,
    collegeName: String,
    branch: String,
    semester: String,
    country: String,
    state: String,
    city: String,
    course: String,
    OtherState: {
      type: String,
      default: "N/A",
    },
    trainingPeriod: String,
    trainingMethod: String,

    uniqueID: String,
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
// Route for handling registration
app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      father_Name,
      mother_Name,
      contactNumber,
      alternateContactNumber,
      email,
      collegeName,
      OtherState,
      country,
      trainingMethod,
      branch,
      semester,
      state,
      city,
      course,
      trainingPeriod,
    } = req.body;
    const registration = new Registration({
      name,
      father_Name,
      mother_Name,
      contactNumber,
      alternateContactNumber,
      email,
      collegeName,
      branch,
      semester,
      country,
      state,
      city,
      course,
      trainingPeriod,
      trainingMethod,
      OtherState,
      uniqueID: Math.floor(Math.random() * 900000) + 100000,
    });
    const savedRegistration = await registration.save();
    res.status(200).json(savedRegistration);
    console.log(savedRegistration);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/api/allStudents", async (req, res) => {
  try {
    const studentDetails = await Registration.find({});
    res.status(200).json(studentDetails);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteData = await Registration.findByIdAndDelete(id);
    // await deleteData.save()
    res.status(200).json(deleteData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    college: { type: String, required: true },
    address: { type: String, required: true },
    coursePDF:{type: String, required: true,default:"Yes"},
    course:{type: String, required: true},
    uniqueID:String
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiries", enquirySchema);

app.post("/api/submit-form", async (req, res) => {
  const { name, email, phone, college, address,course } = req.body;
let uniqueID=Math.floor(Math.random() * 900000) + 100000;
  try {
    const enquirydata = new Enquiry({
      name,
      email,
      phone,
      college,
      address,
      uniqueID,
      course
    });
    const info = await transporter.sendMail({
      from: 'anshinfotech1@gmail.com', // sender address
      to: email, // recipient
      subject: "Thank you for your enquiry", // Subject line
      text: `We have received your enquiry. We will get back to you soon Please note down the below given id for future purposes. Refernce No.:- ${uniqueID}`, // Plain text body
      // You can also include HTML content
      html: `We have received your enquiry. We will get back to you soon Please note down the below given id for future purposes. Refernce No.:- ${uniqueID}`,
    });
    const savedEnquiry = await enquirydata.save();
    console.log(info);
    res.status(200).json({success:true,savedEnquiry});
    console.log(savedEnquiry);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.get("/api/allenquiries",async (req, res) => {
  try {
    const data =await Enquiry.find()
    res.status(200).json({success:true,data})
    console.log(data);
  } catch (error) {
    res.send(error);
  }
})



const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message:{type: String, required: true},
    uniqueID:String
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contactu", contactSchema);

app.post("/api/contact-us", async (req, res) => {
  const { name, email, subject,message } = req.body;

  try {
    const contactdata = new Contact({
      name,
      email,
      subject,
      message,
      uniqueID: Math.floor(Math.random() * 900000) + 100000,
    });
    const savedEnquiry = await contactdata.save();
    res.status(200).json({success:true,savedEnquiry});
    console.log(savedEnquiry);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.get("/api/allcontacts", async (req, res) => {

  try {
    const contactdata = await Contact.find()
    res.status(200).json({success:true,contactdata});
    console.log(contactdata);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});



// Start the server


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});