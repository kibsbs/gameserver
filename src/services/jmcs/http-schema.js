const Joi = require("joi");

const country = Joi.number().required();
const songId = Joi.string().required();

module.exports = {
    Leaderboard: {
        getWorldWideLeaderBoard: {
            body: {
                songId
            }
        },
        getCountryLeaderBoard: {
            body: {
                country,
                songId
            }
        }
    }
}