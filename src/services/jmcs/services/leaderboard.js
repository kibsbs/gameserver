const nas = require("nas-token-client");
const leaderboard = require("leaderboard");
const uenc = require("uenc")

const gameClient = require("games-client");

module.exports = {

    name: `Leaderboard`,
    description: `Provides all Mash-Up data such as online maps and metadata.`,
    version: `1.0.0`,

    async init(app, router) {

        
        router.post("/getWorldWideLeaderBoard", nas.require, gameClient, async (req, res, next) => {
            
            const { songId } = req.body;
            const gameId = req.gid;

            const entries = await leaderboard.getBoard(songId, gameId);

            return res.uenc({
                ...uenc.setIndex(entries),
                count: entries.length,
                startingRank: 1
            });

        });

        router.post("/getCountryLeaderBoard",
            nas.require,
        async (req, res, next) => {

            return res.uenc({
                ...mappedBoard,
                count: leaderboard.length,
                startingRank: 1
            })

        });


    }
    
}