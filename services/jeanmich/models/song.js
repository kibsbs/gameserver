const mongoose = require("mongoose");
const random = require('mongoose-simple-random');

const Schema = new mongoose.Schema(
  {
    __class: {
      type: String,
      default: "SongDescTemplate"
    },
    mapName: {
        type: String,
        required: true
    },
    jdVersion: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    numCoach: {
        type: Number,
        min: [1],
        max: 4,
        required: true
    },
    difficulty: {
        type: Number,
        min: [1],
        max: 4,
        required: true
    },
    songId: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    musicTrackData: {
        type: Object,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
  },
  { timestamps: true, versionKey: false }
);

Schema.plugin(random)

module.exports = mongoose.model("Song", Schema);
