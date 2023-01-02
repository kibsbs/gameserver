const nas = require("nas-token-client");
const leaderboard = require("leaderboard");
const uenc = require("uenc");

module.exports = {

    name: `Leaderboard`,
    description: `Serves global and regional leaderboard data for maps`,
    version: `1.0.0`,

    async init(app, router) {
        
        /**
         * Used for Worldwide Leaderboard for a song
         */
        router.post("/getWorldWideLeaderBoard", nas.require, async (req, res, next) => {
            
            const { songId } = req.body;
            const gameId = req.gid;

            const entries = await leaderboard.getBoard(songId, gameId);

            return res.uenc({
                ...uenc.setIndex(entries),
                count: entries.length,
                startingRank: 1
            });

        });

        /**
         * Used for Country Leaderboard for a song
         */
        router.post("/getCountryLeaderBoard", nas.require, async (req, res, next) => {

            const { songId, country } = req.body;
            const gameId = req.gid;

            const entries = await leaderboard.getBoard(songId, gameId, Number(country));

            return res.uenc({
                ...uenc.setIndex(entries),
                count: entries.length,
                startingRank: 1
            });

        });
    }
}