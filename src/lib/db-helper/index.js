const path = require("node:path")
const fs = require("fs")

function getModelPath(modelName) {
    let modelPath = path.join(__dirname, "models", modelName + ".js")
    if (!fs.existsSync(modelPath)) throw new Error(`${modelName} doesnt have a model file!`)
    
    return modelPath
}

function getModel(modelName) {
    let path = getModelPath(modelName)
    return require(path)
}

module.exports = {
    getModelPath,
    getModel
}