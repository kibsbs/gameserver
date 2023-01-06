const Joi = require("joi")

const uenc = require("uenc")
const utils = require("wdf-utils");

const Session = require("wdf-session");
const Scores = require("wdf-score");

module.exports = {

    name: `getMyRank`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const { onlinescore, sid, song_id, star_score } = req.body;

        const session = new Session(req.game.version);
        const scores = new Scores(req.game.version);

        // User's leveled up their WDF level, update it
        if (onlinescore !== req.profile.rank)
            await scores.updateScore(req.sid, { "profile.rank": onlinescore });

        const userRank = await scores.getRank(req.sid);

        // Get top 10 scores
        const topTen = await scores.getRanks(10);
        const mappedScores = topTen.map(s => {
            return {
                score: s.totalScore,
                name: s.profile.name,
                pays: s.profile.country,
                avatar: s.profile.avatar,
                sid: s.sessionId
            }
        });

        return res.uenc({

            onlinescore_updated: onlinescore,
            ...uenc.setIndex(mappedScores),
            count: await session.sessionCount(),
            total: await scores.scoreCount(),
            myrank: userRank,
            song_id: song_id,
            // theme and coach star counts
            theme0: 0,
            theme1: 0,
            coach0: 0,
            coach1: 0,
            coach2: 0,
            coach3: 0,
            //
            nb_winners: 0,
            star_score,
            numscores: mappedScores.length,
            t: utils.serverTime()

        })

    }
}