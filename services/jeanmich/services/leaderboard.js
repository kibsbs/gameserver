const nasAuth = require("nas-auth-client")
const uenc = require("uenc")

module.exports = {

    name: `Leaderboard`,
    description: `Provides all Mash-Up data such as online maps and metadata.`,
    version: `1.0.0`,

    async init(app, router) {

        const scores = require("jd-scores")
        const maxResult = 3

        /**
         * Generates a leaderboard with given songId, gameId and country.
         */
        async function getLeaderBoard(songId, gameId, country) {

            let query = [ { songId }, { gameId } ]
            if (country) query.push({ 'profile.country': country }) // If country is given add it to query

            let filter = {
                $and: query
            } 

            let dbResult = 
                await scores.db
                    .find(filter)
                    .limit(maxResult)
                    .sort({ score: -1 })
            
            dbResult = dbResult.filter((value, i, self) =>
                i === self.findIndex((t) => (
                    t.profileId === value.profileId
                ))
            )
            return dbResult
        };
        
        router.post("/getWorldWideLeaderBoard",
            nasAuth.require,
        async (req, res, next) => {
            
            const { songId } = req.body
            const gameId = req.token.gid

            const leaderboard = await getLeaderBoard(songId, gameId);
            let mappedBoard = leaderboard.map((p, i) => {
                return {
                    avatar: p.profile.avatar,
                    name: p.profile.name,
                    country: p.profile.country,
                    score: p.totalScore
                }
            });
            mappedBoard = uenc.setIndex(mappedBoard);

            return res.uenc({
                ...mappedBoard,
                count: leaderboard.length,
                startingRank: 1
            })

        });

        router.post("/getCountryLeaderBoard",
            nasAuth.require,
        async (req, res, next) => {

            const { country, songId } = req.body
            const gameId = req.token.gid

            const leaderboard = await getLeaderBoard(songId, gameId, country);
            let mappedBoard = leaderboard.map((p, i) => {
                return {
                    avatar: p.profile.avatar,
                    name: p.profile.name,
                    country: p.profile.country,
                    score: p.totalScore
                }
            });
            mappedBoard = uenc.setIndex(mappedBoard);

            return res.uenc({
                ...mappedBoard,
                count: leaderboard.length,
                startingRank: 1
            })

        });


    }
    
}