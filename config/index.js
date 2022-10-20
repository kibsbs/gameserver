/**
 * GameServer (GS) Main configuration
 * 
 * If you've created a new service, you must added it to "services" object.
 */

module.exports = {

    platforms: ["wii"],

    langs: ["JA", "EN", "DE", "FR", "ES", "IT", "NL", "ZH", "ZH", "KO"],
    langIds: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
    regions: ["NTSC_J", "NTSC", "PAL", "NTSC_K"],
    regionIds: ["00", "01", "02", "03"],

    services: {

        galaxy: {
            path: "/services/galaxy/server.js",
        },

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
    }

}