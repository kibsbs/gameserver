
const Joi = require("joi");

const wdfUtils = require("wdf-utils")
const nasToken = require("nas-token")

const sid =
    Joi.number()
        .required()

const sid_list =
    Joi.string()
        .allow("")
        .required()

const lang =
    Joi.string()
        .default("0")
        .required()

const song_id =
    Joi.number()
        .required()

const stars = Joi.number().min(0).max(7)
const onlinescore = Joi.number().default(1).min(1).max(5000).required()
const gameMode = Joi.number().default(0).min(0).max(5).required()

const token = function(checkConnection = true) {
    return Joi.string().required().custom((token, helpers) => {
        // Verify client's token

        let result = {}
        nasToken.verify(token, (err, payload) => {
            if (err) throw new Error(err);

            // Check if their gameId is eligible for connecting to WDF
            if (checkConnection) {
                let [canConnect, reason] = wdfUtils.canPlayerConnect(payload)
                if (!canConnect) throw new Error(reason)
            }

            result = payload
        })
        return result
    });
} 

const httpSchema = {

    // Only checkToken has checkConnection as false because if the game receives
    // rejection from checktoken it will not connect to any online services
    // so we let the checktoken func check for the connection itself instead of having it in token verification
    checkToken: {
        body: {
            token: token(false)
        }
    },

    disconnectFromWDF: {
        body: {
            sid: sid.optional(),
            token: token()
        }
    },

    getPlayListPos: {
        body: {
            lang,
            token: token()
        }
    },

    getBloomBergs2: {
        body: {
            sid,
            token: token()
        }
    },

    getMyRank: {
        body: {
            onlinescore,
            sid,
            song_id,
            star_score: stars.required(),
            token: token()
        }
    },

    connectToWDF: {
        body: {
            avatar: Joi.number()
                .min(1)
                .max(5000)
                .default(1)
                .required(),
            name: Joi.string()
                .min(1)
                .max(7)
                .regex(/^[A-Z0-9]+$/)
                .required(),
            onlinescore,
            pays: Joi.number().required(),
            token: token()
        }
    },

    getRandomPlayers: {
        body: {
            nr_players: Joi.number()
                .min(1)
                .max(global.config.lobby.maxSessions)
                .default(global.config.lobby.maxSessions)
                .required(),
            player_sid: sid,
            sid_list,
            token: token()
        }
    },

    getRandomPlayersWMap: {
        body: {
            nr_players: Joi.number()
                .min(1)
                .max(10)
                .required(),
            player_sid: sid,
            sid_list,
            token: token()
        }
    },

    getPlayerScores: {
        body: Joi.object({
            event: Joi.string().allow("").required(),
            sid,
            sid_list: Joi.string()
                .allow("")
                .default("")
                .optional(),
            token: token()
        }).unknown(true)
    },

    sendVote: {
        body: {
            sid,
            song_id,
            vote: Joi.number().required(),
            token: token()
        }
    }
};

module.exports = httpSchema;