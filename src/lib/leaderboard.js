const Joi = require("joi");
const dancercard = require("dancercard");

class Leaderboard {
    constructor() {
        this.db = require("./models/score");
        this.schema = Joi.object().keys({
            profileId: Joi.string().required(),
            userId: Joi.string().required(),
            userCountry: Joi.number().required(),
            coachId: Joi.number().min(0).max(3).required(),
            gameMode: Joi.number().required(),
            game: Joi.object().keys({
                id: Joi.string().required(),
                version: Joi.number().required()
            }).required(),
            songId: Joi.string().required(),
            score: Joi.number().min(0).max(global.gs.MAX_SCORE).required(),
            totalScore: Joi.number().min(0).max(1).required(),
            partialScores: Joi.binary().required()
        });
        this.maxResult = global.gs.MAX_LEADERBOARD_SIZE;
    }

    async newScore(data) {
        try {
            const value = await this.schema.validateAsync(data);
            const entry = new this.db(value);
            return await entry.save();
        }
        catch (err) {
            throw new Error(`Can't create Score: ${err}`);
        };
    }

    async getScore(filter) {
        try {
            return await this.db.findOne(filter);
        }
        catch (err) {
            throw new Error(`Can't get Score with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async getScores(filter) {
        try {
            return await this.db.find(filter);
        }
        catch (err) {
            throw new Error(`Can't get many Scores with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async deleteScore(filter) {
        try {
            return await this.db.deleteOne(filter);
        }
        catch (err) {
            throw new Error(`Can't delete Score with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async deleteScores(filter) {
        try {
            return await this.db.deleteMany(filter);
        }
        catch (err) {
            throw new Error(`Can't delete many Scores with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async createBoard(songId, gameId, country) {

        // Filter by songId and gameId and country if provided (for regional boards)
        let filter = [];
        if (country) filter.push({ "userCountry": country });

        // Get data from db and sort by score
        const result = await this.db.aggregate([
            { $match: {
                songId: { $eq: songId },
                "game.id": { $eq: gameId }
            }
            },
            { $group: { _id: "$profileId", root: { $first: "$$ROOT"  } } },
            { $sort: { "root.totalScore": -1 } },
            { $limit: this.maxResult }
        ]);

        return result || [];
    }

    async getBoard(songId, gameId, country) {
        const board = await this.createBoard(songId, gameId, country);

        let entries = [];
        for (let i = 0; i < board.length; i++) {

            const entry = board[i].root;
            const profile = await dancercard.get({ profileId: entry.profileId });
            if (!profile) continue;

            entries.push({
                avatar: profile.avatar,
                name: profile.name,
                country: profile.country,
                score: entry.totalScore
            });
        }

        return entries;
    }
}

module.exports = new Leaderboard();