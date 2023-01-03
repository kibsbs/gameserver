const Joi = require("joi");
const mongoose = require("mongoose");

class Songs {
    constructor() {
        this.db = require("./models/song");
        this.schema = Joi.object({
            mapName: Joi.string().required(),
            title: Joi.string().required(),
            artist: Joi.number().required(),
            version: 2016,
            numCoach: Joi.number().min(1).max(6).required(),
            difficulty: Joi.number().min(1).max(4).required(),
            songId: Joi.number().required(),
            songHash: Joi.string().guid().required(),
            length: Joi.number().required(),
            isAvailable: Joi.boolean().required()
        });
    }

    async new(data) {
        try {
            const value = await this.schema.validateAsync(data);
            const entry = new this.db(value);
            return await entry.save();
        }
        catch (err) {
            throw new Error(`Can't create Song: ${err}`);
        };
    }

    async get(filter) {
        try {
            return await this.db.findOne(filter);
        }
        catch (err) {
            throw new Error(`Can't get Song with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async getMany(filter) {
        try {
            return await this.db.find(filter);
        }
        catch (err) {
            throw new Error(`Can't get many Songs with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async update(toUpdate, data) {
        try {
            return await this.db.findOneAndUpdate(toUpdate, data);
        }
        catch (err) {
            throw new Error(`Can't update Song with ${JSON.stringify(toUpdate)} // ${JSON.stringify(data)}: ${err}`);
        }
    }

    async delete(filter) {
        try {
            return await this.db.deleteOne(filter);
        }
        catch (err) {
            throw new Error(`Can't delete Song with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async deleteMany(filter) {
        try {
            return await this.db.deleteMany(filter);
        }
        catch (err) {
            throw new Error(`Can't delete many Songs with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async exists(filter) {
        return await this.db.exists(filter) ? true : false;
    }
};

module.exports = new Songs();