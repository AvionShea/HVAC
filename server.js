const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/router");

dotenv.config();

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//app.use("/api", apiRoutes);

mongoose.connect(ProcessingInstruction.env.DB_CONNECTION)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = ProcessingInstruction.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));