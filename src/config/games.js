// List of games that are available in Gameserver.

// Example:
// {
//     name: "Just Dance 2014", Full name of the game
//     available: true, If the game is allowed to access services
//     Region games
//     regions: {
//            Region ID
//            SJOP: {
//                region: PAL,
//                available: true You can also enable/disable certain regions
//            },
//            SJOE: {
//                region: NTSC,
//                available: true
//            }
//     },
//     We keep the game's star count, amount of songs and unlocksCount here to detect any cheating
//     stats: { 
//         totalStars: 275, Amount of all that can be earned in game
//         songsCount: 55, Amount of all songs in game
//         unlocksCount: 24 Amount of unlockables (avatars)
//     }
// }

const PAL = "PAL";
const NTSC = "NTSC";

module.exports = [{
    name: "Just Dance 2014",
    version: 2014,
    available: true,
    regions: {
        SJOP: {
            region: PAL,
            available: true
        },
        SJOE: {
            region: NTSC,
            available: true
        }
    },
    stats: {
        totalStars: 275,
        songsCount: 55,
        unlocksCount: 24
    }
}, {
    name: "Just Dance 2015",
    version: 2015,
    available: true,
    regions: {
        SE3P: {
            region: PAL,
            available: true
        },
        SE3E: {
            region: NTSC,
            available: true
        }
    },
    stats: {}
}, {
    name: "Just Dance 2016",
    version: 2016,
    available: true,
    regions: {
        SJNP: {
            region: PAL,
            available: true
        },
        SJNE: {
            region: NTSC,
            available: true
        }
    },
    stats: {}
}, {
    name: "Just Dance 2017",
    version: 2017,
    available: true,
    regions: {
        SZ7P: {
            region: PAL,
            available: true
        },
        SZ7E: {
            region: NTSC,
            available: true
        }
    },
    stats: {
        totalStars: 275,
        songsCount: 55,
        unlocksCount: 24
    }
}, {
    name: "Just Dance 2018",
    version: 2018,
    available: true,
    regions: {
        SE8P: {
            region: PAL,
            available: true
        },
        SE8E: {
            region: NTSC,
            available: true
        }
    },
    stats: {
        totalStars: 275,
        songsCount: 55,
        unlocksCount: 24
    }
}
    // You can add mods here!
    // ...
]