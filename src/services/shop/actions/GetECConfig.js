const Joi = require("joi")

module.exports = {
    id: "GetECConfig",
    schema: Joi.object({
        ECVersion: Joi.string().required()
    }).unknown(true)
};