// Fetched from Dolphin Emulator. Used by JMCS, WDF and DLC store 
// for client's country/region and localization.

module.exports.ENV = process.env.ENV || "local";

module.exports.LANGS = ["JA", "EN", "DE", "FR", "ES", "IT", "NL", "ZH", "ZH", "KO"];
module.exports.LANG_IDS = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
module.exports.REGIONS = ["NTSC_J", "NTSC", "PAL", "NTSC_K"];
module.exports.REGION_IDS = ["00", "01", "02", "03"];

// Set database config by service and env
module.exports.DATABASE = require("./database")[global.service.id][global.env];

// Services
module.exports.SERVICES = {
    galaxy: {
        id: "galaxy",
        name: "Galaxy",
        path: "/services/galaxy/server.js",
    },
    jmcs: {
        id: "jmcs",
        name: "JMCS",
        path: "/services/jmcs/server.js"
    },
    wdf: {
        id: "wdf",
        name: "World Dance Floor (WDF)",
        path: "/services/wdf/server.js"
    }
};