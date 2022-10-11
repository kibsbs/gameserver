module.exports = function(dirName = __dirname) {
    let aliases = {}
    require("fs").readdirSync("./libs").forEach(folder => {
        aliases[folder] = dirName + `/libs/${folder}/index.js`
    });
    return aliases;
}