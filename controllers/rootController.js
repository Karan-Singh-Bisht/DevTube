const asyncHandler = require("../utils/asyncHandler.js");

module.exports.rootController = asyncHandler((req, res) => {
  res.send("Hello World");
});
