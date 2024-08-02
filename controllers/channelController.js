const asyncHandler = require("../utils/asyncHandler");
const channelModel = require("../models/channelModel");
const generateId = require("../utils/generateId");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadOnCloudinary = require("../utils/cloudinary");
const { default: axios } = require("axios");
const subscriptionModel = require("../models/subscriptionModel");
const Subscription = require("../models/subscriptionModel");

const createChannel = asyncHandler(async (req, res) => {
  const channel = req.channel;
  const uid = generateId(channel.id);

  //Check if the handle already exists and is not the current channel's handle
  const existingHandle = await channelModel.findOne({
    handle: req.query.handle,
  });
  console.log(req.query.handle);
  if (req.query.handle && existingHandle && req.query.handle !== channel.uid) {
    throw new ApiError(400, "Handle already exists");
  }

  //Upload logo to cloudinary
  console.log(req.files);
  const logoLocalPath = req.files?.logo[0]?.path;

  const logo = await uploadOnCloudinary(logoLocalPath);

  //Create a collection for the channel using BunnyCDN
  const collectionResponse = await axios.post(
    "Bunny Stiring TODO",
    { name: uid },
    { headers: { AccessKey: process.env.BUNNY_API_KEY } }
  );
  const { guid: collectionId } = collectionResponse.data;

  //Update channel details with handle, name, collectionId, uid, and logoUrl
  Object.assign(channel, {
    handle: req.body.handle,
    name: req.body.name,
    collectionId,
    uid,
    logo: logo,
  });

  //Save the channel to the database
  await channel.save();

  return res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel Created Successfully!"));
});

const updateChannel = asyncHandler(async (req, res) => {
  const channel = req.channel;

  //upload logo if attached
  if (req.file?.logo) {
    const logoLocalPath = req.file?.logo[0]?.path;
    const logo = await uploadOnCloudinary(logoLocalPath);
    Object.assign(channel, { logo });
  }

  //upload banner image if attached
  if (req.file?.bannerImage) {
    const bannerImageLocalPath = req.file?.bannerImage[0]?.path;
    const bannerImage = uploadOnCloudinary(bannerImageLocalPath);
    Object.assign(channel, { bannerImage });
  }

  Object.assign(channel, {
    handle: req.body.handle,
    name: req.body.name,
    description: req.body.description,
  });

  await channel.save();

  return res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel Updated Successfully"));
});

//Fetch a channel by its handle
const getChannelByHandle = asyncHandler(async (handle) => {
  const channel = await channelModel.findOne({ handle });
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }
  return res.status(200).json(new ApiResponse(200, channel, "Channel Found!"));
});

//Fetch a channel by its UID
const getChannelByUID = asyncHandler(async (uid) => {
  const channel = await channelModel.findOne({ uid });
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }
  return res.status(200).json(new ApiResponse(200, channel, "Channel Found!"));
});

//Fetch a channel by its ID
const getChannelByID = asyncHandler(async (id) => {
  const channel = await channelModel.findById(id);
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }
  return res.status(200).json(new ApiResponse(200, channel, "Channel Found!"));
});

//Fetch a subscription by subscriber and channel
const getSubscription = asyncHandler(async ({ subscriber, channel }) => {
  const subscription = await subscriptionModel.findOne({
    subscriber,
    channel,
  });
  if (!subscription) {
    throw new ApiError(404, "Subscriber not found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscriber Found!"));
});

//Fetch channel and subscription information
const getChannelAndSubscription = asyncHandler(
  async (req, res, isHandle = true) => {
    const currentChannel = isHandle
      ? getChannelByHandle(req.params[0])
      : getChannelByUID(req.params[0]);
    if (!currentChannel) {
      res.redirect("/404");
    }

    //Fetch subscription information for the current channel
    const subscription = getSubscription({
      subscriber: req.channel?.id,
      channel: currentChannel.id,
    });

    res.render("devtube", { currentChannel, subscription, page: "channel" });
  }
);

//Subscribe to a channel
const subscribeChannel = asyncHandler(async (req, res) => {
  if (!req.channel) {
    throw new ApiError(400, "Login to Subscribe");
  }
  const channel = await channelModel.findOne({ uid: req.params.uid });
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  if (req.channel.subscription.includes(channel.id)) {
    throw new ApiError(400, "Already subscribed to channel");
  }

  //create a new subscription
  const subscription = await Subscription.create({
    subscriber: req.channel.id,
    channel: channel.id,
    mode: "active",
  });

  //Update subscriptions for both the subscriber and the channel
  req.channel.subscriptions.push(subscription.id);
  channel.subscribers.push(req.channel.id);

  await req.channel.save();
  await channel.save();

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Welcome to the Group!"));
});

const unsubscribeChannel = asyncHandler(async (req, res) => {
  const channel = await channelModel.findOne({ uid: req.params.uid });
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }

  //Fetch the subscription to be removed
  const subscription = getSubscription({
    subscription: req.channel.id,
    channel: channel.id,
  });

  if (!subscription) {
    throw new ApiError(404, "Not Subscribed");
  }

  req.channel.subscriptions.pull(subscription._id);
  channel.subscribers.pull(subscription.subscriber);

  await req.channel.save();
  await channel.save();
  await subscription.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, "Unsubscribed Successfully!"));
});

const notificationChannel = asyncHandler(async (req, res) => {
  const channel = await channelModel.findOne({ uid: req.params.uid });
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }

  //Fetch the subscription to update
  const subscription = getSubscription({
    subscriber: req.channel._id,
    channel: channel._id,
  });

  if (!subscription) {
    throw new ApiError(404, "Not Subscribed");
  }

  //Update the notifications modes
  subscription.mode = req.params.mode === "active" ? "active" : "inactive";

  await subscription.save();

  return res.status(200).json(new ApiResponse(200, "Notification Updated"));
});

module.exports = {
  createChannel,
  updateChannel,
  getChannelByHandle,
  getChannelByUID,
  getChannelByID,
  getSubscription,
  getChannelAndSubscription,
  subscribeChannel,
  unsubscribeChannel,
  notificationChannel,
};
