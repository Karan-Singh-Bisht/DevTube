const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    isShort: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    hashTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    length: {
      type: Number,
    },
    aspect: {
      type: Number,
    },
    category: {
      type: String,
    },
    commentStatus: {
      type: Boolean,
      default: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
    privacySettings: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "private",
      required: true,
    },
    viewsEnabled: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: "Uploading",
      trim: true,
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: "text", description: "text" });
videoSchema.index({ channel: 1 });
videoSchema.index({ length: 1 });
videoSchema.index({ privacySettings: 1 });
videoSchema.index({ uploadDate: 1 });

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
