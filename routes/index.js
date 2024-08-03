const router = express.Router();
const express = require("express");
const checkChannel = require("../middlewares/checkChannel");
const isLoggedIn = require("../middlewares/isLoggedIn");
const TagModel = require("../models/tagModel");
const api = require("./api");
const channel = require("./channel");
const studio = require("./studio");
const watch = require("./watch");
const { default: axios } = require("axios");
const {
  getPlayerLink,
  getTagVideos,
  getPublicVideos,
  getShorts,
} = require("../controllers/videoController");

const {
  getChannelAndSubscription,
} = require("../controllers/channelController");

//Home Page
router.get("/", async (req, res) => {
  res.render("devtube", {
    page: "home",
  });
});

//Search Page
router.get("/search", async (req, res) => {
  res.render("devtube", {
    page: "search",
    search: req.query.search,
  });
});

//Route for getting channel by handle
router.get(/^\@(\w+)$/, getChannelAndSubscription);

//Route for getting videos of a channel by handle
router.get(/^\@(\w+)\/videos$/, getChannelAndSubscription);

//Route for getting shorts of a channel by handle
router.get(/^\@(\w+)\/shorts$/, getChannelAndSubscription);

//Upload redirect
router.get("/upload", checkChannel, isLoggedIn, (req, res) => {
  res.redirect(`/studio/channel/${req.channel.uid}/content?d=ud`);
});

//Hashtag page
router.get("/hashtag/:name", async (req, res) => {
  const hashTag = await TagModel.findOne({ name: req.params.name });
  res.render("devtube", { page: "hashTag", hashTag });
});

//Shorts Page
router.get("/shorts/:uid", async (req, res) => {
  res.render("devtube", {
    page: "shorts",
    uid: req.params.uid,
  });
});

//404 page
router.get("/404", async (req, res) => res.render("404"));

//Forwarded routes
router.use("/api", api);
router.use("/watch", watch);
router.use("/channel", channel);
router.use("/studio", isLoggedIn, checkChannel, studio);

module.exports = router;
