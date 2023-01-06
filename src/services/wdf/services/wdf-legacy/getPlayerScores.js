const Joi = require("joi");

const uenc = require("uenc");
const utils = require("wdf-utils");

const Session = require("wdf-session");
const Score = require("wdf-score");

module.exports = {

    name: `getMyRank`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const { event, sid, sid_list, send_score } = req.body;

        const session = new Session(req.game.version);
        const scores = new Score(req.game.version);

        const count = await session.sessionCount();
        
        let result = {
            num: req.lobby.sessions.length,
            t: utils.serverTime(),
            count
        };

        // Sid List is used for listing given sessionIds profile, score and rank
        if (sid_list.length > 0) {
            const sids = sid_list.filter(sid => sid !== req.sid);
            const sidScores = await scores.getMany({
                sessionId: sids
            });

            const mappedScores = [];

            for (let i = 0; i < sidScores.length; i++) {
                const score = sidScores[i];
                const sid = score.sessionId;
                const rank = await scores.getRank(sid);

                // If sid exists in client's lobby
                if (req.lobby.sessions.includes(sid)) {
                    mappedScores.push({
                        s: sid,
                        sc: score.totalScore,
                        r: rank || count,
                        e: score.event,
                        c: score.coachIndex,
                        o: score.profile.rank
                    });
                }
                else {
                    mappedScores.push({
                        s: sid,
                        sc: -1,
                        r: -1
                    });
                }
            }
            result = {
                ...uenc.setIndex(mappedScores, 1, "_"),
                ...result,
                count: await session.sessionCount()
            };
        }

        // If send score is enabled, it means player will send scores
        // so verify their score data first and then save the data to database
        if (send_score) {
            const schema = Joi.object({
                coachindex: Joi.number().min(0).max(3).optional(),
                lastmove: Joi.boolean().truthy('1').falsy('0').optional(),
                score: Joi.number().optional(),
                song_id: Joi.string().optional(),
                stars: Joi.number().min(0).max(3).optional(),
                themeindex: Joi.number().min(0).max(1).optional(),
                total_score: Joi.number().min(0).max(global.gs.MAX_SCORE).optional()
            }).unknown(true);

            // Validate score data
            const { error, value } = schema.validate(req.body);
            if (error) return next({
                status: 400,
                message: `Can't validate data`,
                error: error.message
            });

            const { 
                coachindex, lastmove, score, 
                song_id,  stars, themeindex, 
                total_score 
            } = value;

            // Upsert user's score to database
            const userScore = await scores.updateScore(req.sid, {
                userId: req.uid,
                sessionId: req.sid,
                game: { id: req.game.id, version: req.game.version },
                profile: req.profile,
                coachIndex: coachindex,
                event: event,
                lastMove: lastmove,
                score: score,
                sendScore: send_score,
                stars: stars,
                themeIndex: themeindex,
                totalScore: total_score
            });
            const userRank = await scores.getRank(req.sid);
            result = {
                ...result,
                score: userScore?.totalScore || 0,
                rank: userRank || 0,
                count: await session.sessionCount(),
                total: await scores.scoreCount(),
                theme0: 0,
                theme1: 0,
                coach0: 0,
                coach1: 0,
                coach2: 0,
                coach3: 0
            }
        }

        return res.uenc(result);
    }
}