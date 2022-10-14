const mongoose = require("mongoose");
const uuid = require("uuid")

const Schema = new mongoose.Schema(
  {
    lobbyId: {
      type: String,
      unique: true,
      dropDups: true,
      default: uuid.v4()
    },
    version: {
      type: Number,
      required: true
    },
    sessions: {
      type: Array,
      default: []
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Lobby", Schema);
