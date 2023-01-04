const Joi = require("joi");

const avatar =  Joi.number().min(0).max(9999).required();
const country = Joi.number().required();
const songId = Joi.string().required();
const playerName = Joi.string().required();
const skuName = Joi.string().valid("NCSA", "EMEA").required();
const lang = Joi.string().required();

module.exports = {
    wdf: {},
    wdfjd6: {
        checkToken: {
            body: {}
        }
    }
}