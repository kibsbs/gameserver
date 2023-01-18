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


module.exports.sessionJd15 = async (req, res, next) => {

    const sid = req.body.sid || req.body.player_sid;
    const ip = req.ip;
    
    if (!sid) return next({
        status: 401,
        message: `SessionId is required for session client!`
    });

    const session = new Session(2015);

    const userSession = await session.getSession(sid);
    if (!userSession) return next({
        status: 401,
        message: `Player does not have a session!`
    });

    if (userSession.ip !== ip) return next({
        status: 401,
        message: `Player submitted unmatched session!`
    });

    // Ping session to avoid it from getting removed
    await session.pingSession(sid);

    req.session = userSession;
    req.profile = userSession.profile;
    return next();
};

module.exports.sessionJd5 = async (req, res, next) => {
    const sid = req.body.sid;
    const version = req.game.version || req.version;
    
    if (!sid) return next({
        status: 401,
        message: `SessionId is required for session client!`
    });
    if (!version) return next({
        status: 401,
        message: `Invalid version!`
    });

    const session = new Session(version);

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

module.exports.sessionJd5Auth = async (req, res, next) => {

    const authorization = req.headers.authorization;
    const auths = global.secrets.TRACKING_AUTH;
    
    if (!authorization) return next({
        status: 401,
        message: `Authorization is required!`
    });

    const b64auth = (req.headers.authorization).split(' ')[1] || null;
    if (!b64auth) return next({
        status: 401,
        message: `Authorization is required!`
    });
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (auths.hasOwnProperty(login) && auths[login].pass === password) {
        req.version = auths[login].version;
        return next();
    }
    else {
        return next({
            status: 401,
            message: `Authorization is required!`
        });
    }
};