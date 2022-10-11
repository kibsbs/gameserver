const mongoose = require("mongoose");
const uuid = require("uuid")

const countries = require("countries")

const Schema = new mongoose.Schema(
  {
    sessionId: {
      type: Number,
      required: true
    },
    version: {
      type: Number,
      required: true
    },
    coachIndex: {
      type: Number,
      required: true
    },
    event: {
      type: String,
      required: true
    },
    lastMove: {
      type: Number,
      required: true
    },
    onlineScore: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    stars: {
      type: Number,
      required: true
    },
    themeIndex: {
      type: Number,
      required: true
    },
    totalScore: {
      type: Number,
      required: true
    },
    profile: {
      type: Object,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("WDFScore", Schema);
