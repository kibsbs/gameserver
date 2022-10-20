const mongoose = require("mongoose");
const uuid = require("uuid")

const Schema = new mongoose.Schema({
    sessionId: {
        type: Number,
        unique: true,
        dropDups: true,
        required: true
    },
    lobbyId: {
        type: String,
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    player: {
        type: Object,
        required: true
    }
},
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Session", Schema);
