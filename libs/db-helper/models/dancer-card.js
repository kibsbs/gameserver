const mongoose = require("mongoose");
const uuid = require("uuid")

// const countries = require("countries")

const Schema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      unique: true,
      dropDups: true,
      default: uuid.v4()
    },
    userId: {
      type: Number,
      unique: true,
      dropDups: true,
      required: true
    },
    avatar: {
      type: Number,
      required: true,
      default: 1
    },
    country: {
      type: Number,
      required: true,
      // function() {
      //   return countries.countryExists({  countryId: this.country  })
      // },
      default: 9627 // Ubisoft country
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: `Dancer`
    },
    songsPlayed: {
      type: Number,
      required: true,
      min: [0],
      default: 0
    },
    stars: {
      type: Number,
      required: true,
      min: [0],
      default: 0
    },
    unlocks: {
      type: Number,
      required: true,
      min: [0],
      default: 0
    },
    wdfRank: {
      type: Number,
      required: true,
      min: [1, `Minimum`],
      max: 5000,
      default: 1
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("DancerCard", Schema);
