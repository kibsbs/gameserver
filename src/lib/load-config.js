const Joi = require("joi");
const path = require("path");

const service = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    path: Joi.string().required(),
    clients: Joi.array().required(),
});

const lang = Joi.object().keys({
    id: Joi.string().required(),
    lang: Joi.string().required(),
});

const region = Joi.object().keys({
    id: Joi.string().required(),
    region: Joi.string().required(),
})

const gs = Joi
    .object()
    .keys({
        GAMES: Joi.array().required(),
        SECRETS: Joi.object().required(),
        DATABASE: Joi.object().required(),
        SERVICES: Joi.object().pattern(/^/, service).required(),
        LANGS: Joi.array().items(lang).required(),
        REGIONS: Joi.array().items(region).required()
    }).unknown(true);

module.exports.gs = (cb) => {
    const gsConfig = require("../config");
  
    const gsVal = gs.validate(gsConfig);
    if (gsVal.error) return cb(`Couldn't verify Gameserver config: ${gsVal.error}`);

    return cb(null, gsVal.value);
};

module.exports.service = (service, cb) => {
    const serviceConfig = require(path.resolve(service.base, "config.js"));

    return cb(null, serviceConfig);
};