module.exports = function(dirName = __dirname) {
    return {
        "models/dancer-card": dirName + "/models/dancer-card.js",
        "models/score": dirName + "/models/score.js",
        "models/song": dirName + "/models/song.js",
    }
}