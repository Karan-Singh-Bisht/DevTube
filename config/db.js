const mongoose = require("mongoose");
const { DB_NAME } = require("../constant");
const axios = require("axios");

const db = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("DB CONNECTED");
  } catch (err) {
    console.log("Couldn't connect to DB", err);
    process.exit(1);
  }
};

const bunnyStreamEndPoint = "";

//Function to create a video entry in BunnyCDN
const createVideoEntry = async (fileName) => {
  const response = await axios.post(
    bunnyStreamEndPoint,
    { title: fileName },
    {
      headers: {
        AccessKey: process.env.BUNNY_STREAM_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.guid;
};

module.exports = { db, createVideoEntry, bunnyStreamEndPoint };
