module.exports = {

    platforms: ["wii"],

    langs: ["JA", "EN", "DE", "FR", "ES", "IT", "NL", "ZH", "ZH", "KO"],
    langIds: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
    regions: ["NTSC_J", "NTSC", "PAL", "NTSC_K"],
    regionIds: ["00", "01", "02", "03"],

    services: {
        jeanmich: {
            path: "/services/jeanmich/server.js",
            rdv: false
        },
        wdf: {
            path: "/services/wdf/server.js",
            rdv: false
        },
        "wdf-2014": {
            path: "/services/wii-2014/server.js",
            rdv: false
        }
    },

    games: require("./games")

}