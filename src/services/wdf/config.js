/**
 * Service configuration
 */

module.exports.PORT = 9000;

module.exports.COMMUNITIES = require("./config/communities");
module.exports.DURATIONS = require("./config/durations");
module.exports.THEMES = require("./config/themes");

module.exports.HAPPYHOUR = {};

// Temporary unlocked songs
module.exports.LOCKED = {
    starCountToUnlock: 404898,
    lastSong: 21832538071, // Zagreb (available in songdb)
    nextSong: 21624006940 // PrinceAli (also unavailable in songdb)
};