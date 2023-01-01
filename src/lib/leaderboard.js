const Joi = require("joi");

class Leaderboard {
    constructor() {
        this.db = require("./models/scores");
        this.schema = Joi.object().keys({
            profileId: Joi.string().required(),
            userId: Joi.string().required(),
            coachId: Joi.number().required(),
            gameMode: Joi.number().required(),
            songId: Joi.number().required(),
            score: Joi.number().required(),
            partialScores: Joi.binary().required()
        });
    }

    async new(data) {
        try {
            const value = await this.schema.validateAsync(data);
            const entry = new this.db(value);
            await entry.save();
        }
        catch (err) {
            throw new Error(`Can't create Dancercard: ${err}`);
        };
    };

    async get(filter) {
        try {
            return await this.db.findOne(filter);
        }
        catch (err) {
            throw new Error(`Can't get Dancercard with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async getMany(filter) {
        try {
            return await this.db.find(filter);
        }
        catch (err) {
            throw new Error(`Can't get many Dancercards with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async update(toUpdate, data) {
        try {
            return await this.db.findOneAndUpdate(toUpdate, data);
        }
        catch (err) {
            throw new Error(`Can't update Dancercard with ${JSON.stringify(toUpdate)} // ${JSON.stringify(data)}: ${err}`);
        }
    }

    async delete(filter) {
        try {
            return await this.db.deleteOne(filter);
        }
        catch (err) {
            throw new Error(`Can't delete Dancercard with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async deleteMany(filter) {
        try {
            return await this.db.deleteMany(filter);
        }
        catch (err) {
            throw new Error(`Can't delete many Dancercards with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async exists(filter) {
        return await this.db.exists(filter) ? true : false;
    }
}