const mongoose = require("mongoose");
const { DB_NAME } = require("../constant");

const db = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DB CONNECTED");
  } catch (err) {
    console.log("Couldn't connect to DB", err);
    process.exit(1);
  }
};

module.exports = db;
