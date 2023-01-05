const Joi = require("joi");

const cheatDetection = require("cheat-detection");

class Session {
    constructor() {
        this.db = require("./models/session");
        this.schema = Joi.object({
            profileId: Joi.string().guid().required(),
            userId: Joi.string().required(),
            sessionId: Joi.string().required(),
            game: Joi.object({
                id: Joi.string().required(),
                version: Joi.number().required()
            }).required(),
            profile: Joi.object({
                avatar: Joi.number().required(),
                name: Joi.string().required(),
                rank: Joi.number().required(),
                country: Joi.number().required(),
            }).required()
        });
    }

    async new(data) {
        try {
            const value = await this.schema.validateAsync(data);
            const entry = new this.db(value);
            return await entry.save();
        }
        catch (err) {
            throw new Error(`Can't create Session: ${err}`);
        };
    };

    async get(filter) {
        try {
            return await this.db.findOne(filter);
        }
        catch (err) {
            throw new Error(`Can't get Session with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async getMany(filter) {
        try {
            return await this.db.find(filter);
        }
        catch (err) {
            throw new Error(`Can't get many Sessions with ${JSON.stringify(filter)}: ${err}`);
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

    async ping(version, userOrSessionId) {
        try {
            return await this.db.findOneAndUpdate({
                "game.version": version,
                $or: [{ userId: userOrSessionId }, { sessionId: userOrSessionId }]
            }, {
                updatedAt: new Date()
            });
        }
        catch (err) {
            throw new Error(`Can't update Dancercard with ${JSON.stringify(toUpdate)} // ${JSON.stringify(data)}: ${err}`);
        }
    }

    async exists(filter) {
        return await this.db.exists(filter) ? true : false;
    }

    async canUserConnect(userOrProfileId) {
        let isBanned = await cheatDetection.isUserBanned(userOrProfileId);
        return (isBanned);
    }
}

module.exports = new Session();