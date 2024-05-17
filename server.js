const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/router");
const app = express();
const https = require("https");
const fs = require("fs");

// Define CORS options
const corsOptions = {
  origin: "https://blogshh.netlify.app",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", router);

// db connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => console.log("db connection successfull"))
  .catch((err) => {
    console.log(err);
  });

const Port = process.env.PORT || 9000;
let server;

server = https.createServer(app);

server.listen(Port, () => console.log(`server is listening at port ${Port}`));
