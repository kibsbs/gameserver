const Joi = require("joi");

module.exports = {
    createBots: {
        amount: Joi.number().min(1).required(),
        version: Joi.number().required()
    },
    deleteBots: {
        version: Joi.number().required()
    }
};