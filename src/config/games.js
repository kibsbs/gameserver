// List of games that are available in Gameserver.

// Example:
// {
//     name: "Just Dance 2014", Full name of the game
//     available: true, If the game is allowed to access services
//     regions: [{ 
//         region: PAL, Region ID
//         gameId: "SJOP", Game ID
//         available: true If region is allowed to access services
//     }, { 
//         region: NTSC,
//         gameId: "SJOE",
//         available: true
//     }],
//     We keep the game's star count, amount of songs and unlocksCount here to detect any cheating
//     stats: { 
//         totalStars: 275, Amount of all that can be earned in game
//         songsCount: 55, Amount of all songs in game
//         unlocksCount: 24 Amount of unlockables (avatars)
//     }
// }

const PAL = "PAL";
const NTSC = "NTSC";

module.exports = {
    2014: {
        name: "Just Dance 2014",
        available: true,
        regions: [{ 
            region: PAL,
            gameId: "SJOP",
            available: true
        }, { 
            region: NTSC,
            gameId: "SJOE",
            available: true
        }],
        stats: {
            totalStars: 275,
            songsCount: 55,
            unlocksCount: 24
        }
    },
    2015: {
        name: "Just Dance 2015",
        available: true,
        regions: [{ 
            region: PAL,
            gameId: "SE3P",
            available: true
        }, { 
            region: NTSC,
            gameId: "SE3E",
            available: true
        }],
        stats: {}
    },
    2016: {
        name: "Just Dance 2016",
        available: true,
        regions: [{ 
            region: PAL,
            gameId: "SJNP",
            available: true
        }, { 
            region: NTSC,
            gameId: "SJNE",
            available: true
        }],
        stats: {}
    },
    2017: {
        name: "Just Dance 2017",
        available: true,
        regions: [{ 
            region: PAL,
            gameId: "SZ7P",
            available: true
        }, { 
            region: NTSC,
            gameId: "SZ7E",
            available: true
        }],
        stats: {
            totalStars: 275,
            songsCount: 55,
            unlocksCount: 24
        }
    },
    2018: {
        name: "Just Dance 2018",
        available: true,
        regions: [{ 
            region: PAL,
            gameId: "SE8P",
            available: true
        }, { 
            region: NTSC,
            gameId: "SE8E",
            available: true
        }],
        stats: {
            totalStars: 275,
            songsCount: 55,
            unlocksCount: 24
        }
    }
    // You can add mods here!
    // ...
};