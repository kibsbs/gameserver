const Joi = require("joi");

const games = require("games");

class Score {
    constructor(version) {
        this.version = version;
        if (!games.isGameAvailable(this.version))
            throw new Error(`${version} is not available for use!`);

        const Playlist = require("wdf-playlist");
        this.playlist = new Playlist(this.version);
        this.game = games.getGameByVersion(this.version);
        
        this.db = require("./models/wdf-score");
        const schema = Joi.object({
            userId: Joi.string().required(),
            sessionId: Joi.string().required(),
            game: Joi.object().required(),
            profile: Joi.object().required(),
            coachIndex: Joi.number().min(0).max(3).required(),
            event: Joi.string().required(),
            lastMove: Joi.boolean().truthy('1').falsy('0').required(),
            score: Joi.number().required(),
            sendScore: Joi.boolean().truthy('1').falsy('0').required(),
            stars: Joi.number().required(),
            themeIndex: Joi.number().required(),
            totalScore: Joi.number().min(0).max(global.gs.MAX_SCORE).required()
        });
        const schema2014 = Joi.object({
            userId: Joi.string().required(),
            sessionId: Joi.string().required(),
            game: Joi.object().required(),
            profile: Joi.object().required(),
            coachIndex: Joi.number().min(0).max(3).required(),
            lastMove: Joi.boolean().truthy('1').falsy('0').required(),
            score: Joi.number().required(),
            stars: Joi.number().required(),
            themeIndex: Joi.number().required(),
            totalScore: Joi.number().min(0).max(global.gs.MAX_SCORE).required()
        });
        this.schema = this.game.is2014 ? schema2014 : schema;
    }

    async updateScore(sessionId, scoreData) {
        try {
            return await this.db.findOneAndUpdate({
                sessionId,
                "game.version": this.version
            },
                scoreData,
                { upsert: true }
            );
        }
        catch (err) {
            throw new Error(`Can't upsert WDF Score: ${err}`);
        };
    }

    async updateRank(sessionId, rank) {
        try {
            return await this.db.findOneAndUpdate({ sessionId, "game.version": this.version }, { "profile.rank": rank });
        }
        catch (err) {
            throw new Error(`Can't update WDF rank of ${sessionId} / rank: ${rank}: ${err}`);
        };
    }

    async deleteScore(filter) {
        try {
            return await this.db.deleteMany({ ...filter, "game.version": this.version });
        }
        catch (err) {
            throw new Error(`Can't delete WDF Scores with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async getScore(sessionId) {
        try {
            return await this.db.findOne({ sessionId, "game.version": this.version });
        }
        catch (err) {
            throw new Error(`Can't get WDF Score for ${sessionId}: ${err}`);
        }
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

    async getThemeResult(themeIndex = 0) {
        try {
            const result = await this.db.aggregate([
                { $match: { "game.version": this.version, themeIndex: { $eq: themeIndex } } },
                { $group: { _id: null, stars: { $sum: "$stars" } } }
            ]);
            return result[0] ? result[0].stars : 0
        }
        catch(err) {
            throw new Error(`Can't get theme results for ${this.version} index: ${themeIndex}: ${err}`)
        }
    }

    async getCoachResult(coachIndex = 0) {
        try {
            const result = await this.db.aggregate([
                { $match: { "game.version": this.version, coachIndex: { $eq: coachIndex } } },
                { $group: { _id: null, stars: { $sum: "$stars" } } }
            ])
            return result[0] ? result[0].stars : 0
        }
        catch(err) {
            throw new Error(`Can't get coach results for ${this.version} index: ${themeIndex}: ${err}`)
        }
    }

    async getThemeAndCoachResult() {
        const currentTheme = await this.playlist.getCurrentTheme();
        const isCommunity = this.playlist.isThemeCommunity(currentTheme);
        const isCoach = this.playlist.isThemeCoach(currentTheme);
        return {
            currentTheme,
            isCommunity,
            isCoach,
            themeResults: {
                [this.game.is2014 ? "score_theme0" : "theme0"]: (isCommunity ? await this.getThemeResult(0) : 0) * 2000,
                [this.game.is2014 ? "score_theme1" : "theme1"]: (isCommunity ? await this.getThemeResult(1) : 0) * 2000,
                [this.game.is2014 ? "score_coach0" : "coach0"]: (isCoach ? await this.getCoachResult(0) : 0) * 2000,
                [this.game.is2014 ? "score_coach1" : "coach1"]: (isCoach ? await this.getCoachResult(1) : 0) * 2000,
                [this.game.is2014 ? "score_coach2" : "coach2"]: (isCoach ? await this.getCoachResult(2) : 0) * 2000,
                [this.game.is2014 ? "score_coach3" : "coach3"]: (isCoach ? await this.getCoachResult(3) : 0) * 2000
            }
        }
    }

    async getNumberOfWinners(results) {
        if (!results)
            throw new Error(`Theme result list required for winners`);
        
        // Get key with highest value from themecoach result and get it's index
        // (this is a dumb way, please make a better method in future)
        let key = Object.keys(results).reduce(function(a, b){ return results[a] > results[b] ? a : b });
        let index = Number(key.substring(5));
        let query = {};

        if (key.startsWith("coach"))
            query = { coachIndex: index };
        else if (key.startsWith("theme"))
            query = { themeIndex: index };
        
        return await this.db.count({ ...query, "game.version": this.version });
    }
};

module.exports = Score;