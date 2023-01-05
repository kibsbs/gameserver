const Joi = require("joi").extend(joi => ({
    base: joi.array(),
    coerce: (value, helpers) => ({
      value: value.split ? value.split(';') : value,
    }),
    type: 'versionArray',
}));

const avatar =  Joi.number().required();
const country = Joi.number().required();
const wdfRank = Joi.number().required();
const songId = Joi.string().required();
const playerName = Joi.string().required();
const skuName = Joi.string().valid("NCSA", "EMEA").required();
const lang = Joi.string().required();
const sid = Joi.string().required();
const sidList = Joi.versionArray().required();

module.exports = {
    wdf: {},
    wdfjd6: {
        checkToken: {
            body: {}
        },
        getPlayListPos: {
            body: {
                lang
            }
        },
        connectToWDF: {
            body: {
                avatar,
                name: playerName,
                onlinescore: wdfRank,
                pays: country
            }
        },
        getRandomPlayersWMap: {
            body: {
                nr_players: Joi.number().min(0).max(10),
                sid,
                sid_list: sidList
            }
        }
    }
}