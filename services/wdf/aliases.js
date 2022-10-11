module.exports = function(dirName = __dirname) {
    return {
        "models/score": dirName + "/models/wdf-score.js",
        "models/session": dirName + "/models/wdf-session.js",
        "models/lobby": dirName + "/models/wdf-lobby.js",
        "wdf-utils": dirName + "/libs/wdf-utils.js",
        "http-scheme": dirName + "/libs/http-scheme.js",
        "schema-validator": dirName + "/middlewares/schema-validator.js",
    }
}