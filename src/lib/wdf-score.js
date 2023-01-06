const Joi = require("joi");

const games = require("games");

class Score {
    constructor(version) {
        this.version = version;
        if (!games.isGameAvailable(this.version))
            throw new Error(`${version} is not available for use!`);

        this.db = require("./models/wdf-score");
        this.schema = Joi.object({
            userId: Joi.string().required(),
            sessionId: Joi.string().required(),
            game: Joi.object().required(),
            profile: Joi.object().required(),
            coachIndex: Joi.number().min(0).max(3).required(),
            event: Joi.string().required(),
            lastMove: Joi.boolean().truthy('1').falsy('0').required(),
            score: Joi.number().required(),
            sendScore: Joi.boolean().truthy('1').falsy('0').required(),
            stars: Joi.number().min(0).max(3).required(),
            themeIndex: Joi.number().min(0).max(1).required(),
            totalScore: Joi.number().min(0).max(global.gs.MAX_SCORE).required()
        });
    }

    async updateScore(sessionId, scoreData) {
        try {
            return await this.db.findOneAndUpdate({ sessionId }, scoreData, { upsert: true });
        }
        catch (err) {
            throw new Error(`Can't upsert WDF Score: ${err}`);
        };
    }

    async get(filter) {
        try {
            return await this.db.findOne(filter);
        }
        catch (err) {
            throw new Error(`Can't get WDF Score with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async getMany(filter) {
        try {
            return await this.db.find(filter);
        }
        catch (err) {
            throw new Error(`Can't get many WDF Scores with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async resetScores() {
        try {
            return await this.db.deleteMany({
                "game.version": this.version
            });
        }
        catch (err) {
            throw new Error(`Can't reset WDF Scores for ${version}: ${err}`);
        }
    }

    async exists(filter) {
        return await this.db.exists(filter) ? true : false;
    }

    async scoreCount() {
        return await this.db.count({ "game.version": this.version }) || 0;
    }

    async getRank(sid) {
        const ranks = await this.getRanks();
        const result = ranks.filter(s => s.sessionId === sid);

        if (!result[0]) return null;
        return result[0].rank;
    }

    async getRanks(limit) {
        let pipeline = [
            { $match: { "game.version": this.version } },
            { $sort: { totalScore: -1 } },
            {
                $group: {
                    _id: false,
                    data: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $unwind: {
                    path: "$data",
                    includeArrayIndex: "rank"
                }
            }
        ]
        if (limit) pipeline.push({
            $limit: limit
        });
        
        let ranks = await this.db.aggregate(pipeline);
        ranks = ranks.map(r => { 
            r.rank += 1; 
            r = { ...r.data, rank: r.rank }; 
            delete r.data; 
            return r; 
        });
        return ranks;
    }
};

module.exports = Score;