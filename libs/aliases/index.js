const path = require("node:path")
const fs = require("fs")

const moduleAlias = require("module-alias")

module.exports.register = (dirName, extraLibs = {}) => { 

    let aliases = {}

    if (dirName) {
        let libsPath = path.join(dirName, "libs")
        if (fs.existsSync(libsPath))
            require("fs").readdirSync(libsPath).forEach(folder => {
                aliases[folder] = path.join(libsPath, folder, "index.js")
            });
    }

    if (Object.keys(extraLibs).length > 0) {

        if (!dirName) throw new Error(`dirName param is required for extra libs to work!`)

        for (const libName in extraLibs) {

            let libFolder = extraLibs[libName]
            let fullPath = path.join(dirName, libFolder)

            aliases[libName] = fullPath
        }

    }
    
    moduleAlias.addAliases(aliases)
    return aliases;
}