const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    mapName: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    uniqueSongId: {
        type: Number,
        required: true,
        unique: true,
        dropDups: true
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
    tags: {
        type: Array,
        default: ["main"]
    },
    hash: {
        type: String,
        default: require("uuid").v4()
    },
    mapLength: {
        type: Number,
        required: true
    },
    /*
    musicTrackData: {
        type: Object,
        required: true
    },
    */
    isAvailable: {
        type: Boolean,
        default: true
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Song", Schema);
