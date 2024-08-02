require("module-alias/register");

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const { db } = require("./config/db");
db();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routes

//routes declaration

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
