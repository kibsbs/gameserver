const Joi = require("joi")

const uenc = require("uenc")
const utils = require("wdf-utils");

const Session = require("wdf-session");
const Scores = require("wdf-score");

module.exports = {

    name: `getMyRank`,
    description: `Serves rank status for top 10 players & client's score`,
    version: `1.0.0`,

    async init(req, res, next) {

        const { onlinescore, sid, song_id, star_score } = req.body;

        const session = new Session(req.game.version);
        const scores = new Scores(req.game.version);

        // User's leveled up their WDF level, update it
        // TODO: maybe have 1 function to updateRank OR
        // remove profile from score and make session have it only
        await session.updateRank(req.sid, onlinescore);
        await scores.updateRank(req.sid, onlinescore);

        const count = await session.sessionCount();
        const total = await scores.scoreCount();

        const userRank = await scores.getRank(req.sid);
        const userScore = await scores.getScore(req.sid);

        // Get theme results (coach/theme) and amount of winning side's player count
        const { themeResults } = await scores.getThemeAndCoachResult();
        const winners = await scores.getNumberOfWinners(themeResults);

        // Get top 10 scores
        const topTen = await scores.getRanks(10);
        const mappedScores = topTen.map(s => {
            return {
                score: s.totalScore,
                name: s.profile.name,
                pays: s.profile.country,
                avatar: s.profile.avatar,
                onlinescore: s.profile.rank,
                sid: s.sessionId
            };
        });

        return res.uenc({
            onlinescore_updated: onlinescore,

            ...uenc.setIndex(mappedScores),

            count,
            total,
            
            myrank: userRank || count,
            myscore: userScore?.totalScore || 0,
            song_id: song_id,

            ...themeResults,

            nb_winners: winners,
            star_score,
            numscores: mappedScores.length,
            
            t: utils.serverTime()
        });
    }
}