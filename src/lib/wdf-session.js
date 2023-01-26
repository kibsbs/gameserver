const Joi = require("joi");
const uuid = require("uuid");

const utils = require("utils");

const games = require("games");
const cheatDetection = require("cheat-detection");
const cache = require("cache");

const Score = require("wdf-score");

class Session {
    constructor(version) {
        this.version = version;
        if (!games.isGameAvailable(this.version))
            throw new Error(`${version} is not available for use!`);
        
        this.scores = new Score(this.version);
        this.db = require("./models/session");
        this.game = games.getGameByVersion(this.version);
        this.schema = Joi.object({
            // profileId: Joi.string().guid().required(),
            userId: Joi.string().required(),
            sessionId: Joi.string().required(),
            lobbyId: this.game.isJD5 ? Joi.string().guid().optional() : Joi.string().guid().required(),
            game: Joi.object({
                id: Joi.string().required(),
                version: Joi.number().required()
            }).required(),
            profile: Joi.object({
                avatar: Joi.number().required(),
                name: Joi.string().regex(global.gs.NAME_REGEX).custom(utils.profane, 'profanity check').required(),
                rank: Joi.number().required(),
                country: Joi.number().required(),
            }).unknown(true).required(),
            isBot: Joi.boolean().default(false).optional(),
            isJD5: Joi.boolean().default(this.game.isJD5 || false)
        }).unknown(true);

        this.cacheSchema = Joi.object({
            avatar: Joi.number().required(),
            name: Joi.string().regex(global.gs.NAME_REGEX).custom(utils.profane, 'profanity check').required(),
            rank: Joi.number().required(),
            country: Joi.number().required(),
            isJD5: Joi.boolean().default(this.game.isJD5 || false)
        }).unknown(true);

        this.maxLobbyPlayers = global.gs.MAX_LOBBY_PLAYERS;

        // Lobby pipeline
        this.pipeline = [{
                $group: {
                    _id: "$lobbyId",
                    sessions: { $push: "$sessionId" }
                }
            },
            {
                $match: {
                    [`sessions.${this.maxLobbyPlayers-1}`]: {
                        $exists: false
                    }
                }
        }];
        this.cacheKey = !this.game.isJD5 ? 
        `wdf-player-cache:${this.version}` : `wdf-player-cache`
    }

    
    /**
     * Sessions
     * 
     * Sessions are handled in database, and pinged constantly by session-client
     * if a player hasn't pinged in certain time, their session gets erased
     * which automatically removes from their lobby too
     */
    async newSession(data, forcedLobbyId) {
        try {
            let sessionId = data.sessionId;

            // Join user to a lobby if version is not 2014
            if (!this.game.isJD5) {
                // If a forced lobby id was given, join user to that lobby
                if (forcedLobbyId) data.lobbyId = forcedLobbyId;
                // If not, join user to an available lobby.
                else {
                    const lobbyId = await this.joinLobby(sessionId);
                    data.lobbyId = lobbyId;
                }
            }

            const value = await this.schema.validateAsync(data);
            const entry = new this.db(value);

            return await entry.save();
        }
        catch (err) {
            throw new Error(`Can't create Session: ${err}`);
        };
    }

    async getSession(sessionId) {
        try {
            return await this.db.findOne({ sessionId, "game.version": this.version });
        }
        catch (err) {
            throw new Error(`Can't get Session with ${sessionId}: ${err}`);
        }
    }

    async getManySessions(filter) {
        try {
            return await this.db.find({ ...filter, "game.version": this.version });
        }
        catch (err) {
            throw new Error(`Can't get many Sessions with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    /**
     * Deletes session and any score entries by player
     * @param {*} sessionId 
     * @returns 
     */
    async deleteSession(sessionId) {
        try {
            const query = {
                sessionId,
                "game.version": this.version
            };
            await this.scores.deleteScore(query); // Delete scores
            return await this.db.deleteOne(query); // Delete session
        }
        catch (err) {
            throw new Error(`Can't delete Session with ${JSON.stringify(sessionId)}: ${err}`);
        }
    }

    async deleteManySessions(filter) {
        try {
            return await this.db.deleteMany({ "game.version": this.version, ...filter });
        }
        catch (err) {
            throw new Error(`Can't delete many Sessions with ${JSON.stringify(filter)}: ${err}`);
        }
    }

    async updateRank(sessionId, rank) {
        try {
            return await this.db.findOneAndUpdate({ sessionId, "game.version": this.version }, { "profile.rank": rank });
        }
        catch (err) {
            throw new Error(`Can't update WDF rank of ${sessionId} / rank: ${rank}: ${err}`);
        };
    }

    async pingSession(userOrSessionId) {
        try {
            return await this.db.findOneAndUpdate({
                "game.version": this.version,
                $or: [{ userId: userOrSessionId }, { sessionId: userOrSessionId }]
            }, {
                updatedAt: new Date()
            });
        }
        catch (err) {
            throw new Error(`Can't ping Session with ${this.version} - ${userOrSessionId}: ${err}`);
        }
    }

    async randomSession(amount = 1, excludeSid) {
        try {
            return await this.db.aggregate([
                {
                    $match: {
                        "game.version": this.version,
                        sessionId: { $ne: excludeSid }
                    }
                },
                { 
                    $sample: { size: amount } 
                }
            ])
        }
        catch(err) {
            throw new Error(`Can't get random sessions with amount ${amount}: ${err}`);
        }
    }

    async sessionCount() {
        return await this.db.count({ "game.version": this.version })
    }

    async createSessionCache(sessionId, data) {
        try {
            // Validate session object
            const value = await this.cacheSchema.validateAsync(data);
            return await cache.set(`${this.cacheKey}:${sessionId}`, value, global.gs.TOKEN_EXPIRATION);
        }
        catch(err) {
            throw new Error(`Can't create session cache for ${sessionId}: ${err}`);
        }
    }

    async getSessionCache(sessionId, ip) {
        try {
            const data = await cache.get(`${this.cacheKey}:${sessionId}`);
    
            // If version is 2015, IP is provided but sid's cache data 
            // does not match provided IP, return null so that funcs don't allow client.
            if ((this.version == 2015 && ip) && (data && data.ip !== ip)) return;
            
            return data;
        }
        catch(err) {
            throw new Error(`Can't get session cache for ${sessionId}: ${err}`);
        }
    }

    async deleteSessionCache(sessionId, ip) {
        try {
            const data = await this.getSessionCache(sessionId, ip);
    
            // If version is 2015, IP is provided but sid's cache data 
            // does not match provided IP, return null so that funcs don't allow client.
            if ((this.version == 2015 && ip) && (data && data.ip !== ip)) return;

            return await cache.set(`${this.cacheKey}:${sessionId}`, null);
        }
        catch(err) {
            throw new Error(`Can't delete session cache for ${sessionId}: ${err}`);
        }
    }
    
    /**
     * Lobbies
     * 
     * Lobbies are no longer seperate documents, when a player joins WDF
     * the server groups all players and their lobbyIds and create a lobby like that
     * and then find an empty one for client and append that lobby's id to their session
     * {
     *  sessionId: 22,
     *  lobbyId: 45056
     * }
     * would be grouped like
     * {
     *  _id: 45056,
     *  sessions: [22]
     * }
     * creating lobbies internally only
     */

    async getLobby(lobbyId) {
        const result = await this.db.aggregate([
            {
                $match: { "game.version": this.version }
            },
            {
                $group: {
                    _id: "$lobbyId",
                    sessions: { $push: "$sessionId" }
                }
            },
            {
                $match: { _id: lobbyId }
            }
        ]);
        if (result && result[0]) return result[0];
        else return null;
    }
    
    async getLobbies() {
        const result = await this.db.aggregate([
            {
                $match: { "game.version": this.version }
            },
            {
                $group: {
                    _id: "$lobbyId",
                    sessions: { $push: "$sessionId" }
                }
            }
        ]);
        return result;
    }
    
    async findAvailableLobby() {
        const result = await this.db.aggregate([
            {
                $match: { "game.version": this.version }
            },
            ...this.pipeline,
            // Sort by highest session so that player joins the most crowded lobby
            {   
                $sort: {"sessions":1} 
            }
        ]);
        if (result && result[0]) return result[0];
        else return null;
    }

    async isLobbyAvailable(lobbyId) {
        const lobbies = await this.getLobbies();
        const result = lobbies.filter(l => l._id === lobbyId);
        if (!result || !result[0]) return false;

        if (result[0].sessions.length < this.maxLobbyPlayers) return true;
        return false;
    }

    async joinLobby(sessionId) {
        let lobbyId;
        let availableLobby = await this.findAvailableLobby();
        
        // If there's an available lobby, set the lobbyId
        // else, we create a new lobby so generate a new ID
        if (availableLobby)
            lobbyId = availableLobby["_id"];
        else lobbyId = uuid.v4();

        return lobbyId;
    }

    /** */

    async exists(userOrSessionId) {
        return await this.db.exists({
            $or: [{ userId: userOrSessionId }, { sessionId: userOrSessionId }]
        }) ? true : false;
    }

    async canUserConnect(userId) {
        let isBanned = await cheatDetection.isUserBanned(userId);
        return !isBanned;
    }

    async getCountryPlayers(country) {
        return await this.db.count({
            "game.version": this.version,
            "profile.country": country
        });
    }

    /** */
}

module.exports = Session;