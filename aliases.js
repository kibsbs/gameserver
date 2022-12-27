const path = require("path")
const { getModelPath } = require("db-helper")

function joinService(srvName, libs = {}) {
    for (const key in libs) {
        if (Object.hasOwnProperty.call(libs, key)) {
            const libPath = libs[key];
            if (key.includes("models/")) continue;
            
            libs[key] = path.join(__dirname, "services", srvName, libPath)
        }
    }
    return libs
}

let jeanmich = joinService("jeanmich", {
    "models/dancer-card": getModelPath("dancer-card"),
    "models/score": getModelPath("score"),
})

let wdf = joinService("wdf", {
    "models/score": getModelPath("wdf-score"),
    "models/session": getModelPath("session"),
    "models/lobby": getModelPath("lobby"),
    "models/song": getModelPath("song"),
    
    "wdf-utils": "/libs/wdf-utils.js",
    "http-scheme": "/libs/http-scheme.js",
    "schema-validator": "/middlewares/schema-validator.js",
    "session-client": "/middlewares/session-client.js",
    "wdf-middleware": "/middlewares/wdf-middleware.js",
    "query-middleware": "/middlewares/query-middleware.js",
})

let galaxy = {
    "models/song": getModelPath("song")
}

module.exports = {
    jeanmich,
    wdf,
    galaxy
}