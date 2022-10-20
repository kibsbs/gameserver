const mongoose = require("mongoose");
const uuid = require("uuid")

const Schema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      required: true
    },
    songId: {
      type: Number,
      required: true
    },
    coachId: {
      type: Number,
      required: true
    },
    gameId: {
      type: String,
      required: true
    },
    gameMode: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalScore: {
      type: Number,
      required: true
    },
    partialScores: {
      type: Buffer,
      required: true
    },
    profile: {
      type: Object,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Score", Schema);
