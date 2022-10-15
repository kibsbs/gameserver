module.exports = function(dirName = __dirname) {
    return {
        "models/score": dirName + "/models/score.js",
        "models/session": dirName + "/models/session.js",
        "models/lobby": dirName + "/models/lobby.js",
        
        "wdf-utils": dirName + "/libs/wdf-utils.js",
        "http-scheme": dirName + "/libs/http-scheme.js",
        "schema-validator": dirName + "/middlewares/schema-validator.js",
        "session-client": dirName + "/middlewares/session-client.js",
        "wdf-middleware": dirName + "/middlewares/wdf-middleware.js",
        "query-middleware": dirName + "/middlewares/query-middleware.js",
    }
}