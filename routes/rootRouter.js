const express = require("express");
const router = express.Router();
const { rootController } = require("../controllers/rootController.js");

router.get("/", rootController);

module.exports = router;
