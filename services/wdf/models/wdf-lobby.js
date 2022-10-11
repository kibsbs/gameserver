const mongoose = require("mongoose");
const uuid = require("uuid")

const countries = require("countries")

const Schema = new mongoose.Schema(
  {
    lobbyId: {
      type: String,
      unique: true,
      dropDups: true,
      default: uuid.v4()
    },
    players: {
      type: Array,
      default: []
    },
    version: {
      type: Number,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("WDFLobby", Schema);
