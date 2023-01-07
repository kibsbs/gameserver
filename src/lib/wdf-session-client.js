/**
 * Session and Lobby client
 */

const Session = require("wdf-session");
const cheatDetection = require("cheat-detection");

module.exports.lobby = async (req, res, next) => {
    let userSession = req.session;
    if (!userSession) return next({
        status: 401,
        message: `Session client is required for lobby client!`
    });

    const session = new Session(req.game.version);
    const lobbyId = userSession.lobbyId;
    const lobbyData = await session.getLobby(lobbyId);

    req.lobby = lobbyData;
    return next();
};

module.exports.session = async (req, res, next) => {

    const sid = req.sid;
    const game = req.game;
    
    if (!sid) return next({
        status: 401,
        message: `SessionId is required for session client!`
    });
    if (!game) return next({
        status: 401,
        message: `Game client is required for session client!`
    });

    const session = new Session(req.game.version);

    const userSession = await session.getSession(sid);
    if (!userSession) return next({
        status: 401,
        message: `Player does not have a session!`
    });

    // Ping session to avoid it from getting removed
    await session.pingSession(sid);

    req.session = userSession;
    req.profile = userSession.profile;
    return next();
};