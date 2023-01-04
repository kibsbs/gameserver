const Joi = require("joi")

const uenc = require("uenc")
const utils = require("utils")

const session = require("jd-session")
const scores = require("jd-scores")
const lobby = require("jd-lobby")

module.exports = {

    name: `getMyRank`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        let { onlinescore, sid, song_id, star_score } = req.body

        const updatedScore = await session.updateOnlineScore(req.version, req.sessionId, onlinescore)

        let ranks = await scores.getRanks(req.version, 10) // Get all scores by version

        // Finds rank of given sessionId
        // basically index of given sessionid in ranks array is their rank
        // (there is probably a better way in mongo to do the rank system)
        function getRank(sessionId) {
            let rank = ranks.findIndex(s => s.sessionId == sessionId) + 1

            if (rank == 0) return -1
            else return rank
        }

        let entries = ranks.map(s => {
            return {
                score: s.totalScore,
                name: s.player.name,
                pays: s.player.country,
                rank: getRank(s.sessionId),
                avatar: s.player.avatar,
                onlinescore: s.player.onlinescore
            }
        })

        return res.uenc({

            onlinescore_updated: updatedScore,

            ...uenc.setIndex(entries),

            count: await session.count(req.version),
            total: 0,

            myrank: getRank(req.sessionId),

            song_id,

            // theme and coach star counts
            theme0: 0,
            theme1: 0,
            coach0: 0,
            coach1: 0,
            coach2: 0,
            coach3: 0,
            
            nb_winners: 0,

            star_score,

            numscores: entries.length,

            t: utils.getServerTime()

        })

    }
}