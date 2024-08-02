const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    uid: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      trim: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    bannerImage: {
      type: String,
      trim: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],
    collectionId: {
      type: String,
      sparse: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

//Adding Partial Indexes for fast retrieval and searching of data
channelSchema.index(
  { uid: 1 },
  {
    unique: true,
    partialFilterExpression: { uid: { $exists: true, $ne: null } },
  }
);

channelSchema.index(
  { handle: 1 },
  {
    unique: true,
    partialFilterExpression: { handle: { $exists: true, $ne: null } },
  }
);

channelSchema.index(
  { collectionId: 1 },
  {
    unique: true,
    partialFilterExpression: { collectionId: { $exists: true, $ne: null } },
  }
);

channelSchema.index({ name: "text", description: "text" });

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
