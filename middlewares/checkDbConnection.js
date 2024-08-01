const mongoose = require("mongoose");

//middleware to check the database connection status
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database not connected" });
  }
  next();
};

module.exports = checkDBConnection;
