const Joi = require("joi").extend(joi => ({
    base: joi.array(),
    coerce: (value, helpers) => ({
      value: value.split ? value.split(';').filter(a => a) : value,
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
                nr_players: Joi.number().min(0).max(10).required(),
                player_sid: sid,
                sid_list: sidList
            }
        },
        getPlayerScores: {
            body: {

                // Send score = 0 body params are checked here
                // Send score = 1 params are validated in getPlayerScores func
                event: Joi.string().allow("").required(),
                sid,
                sid_list: sidList,
                send_score: Joi.boolean().truthy('1').falsy('0').optional()
            }
        },
        getMyRank: {
            body: {
                onlinescore: wdfRank,
                sid,
                song_id: songId,
                star_score: Joi.number().required()
            }
        }
    }
}