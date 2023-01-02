const games = require("games");

/**
 * Appends client's game with gameId from token
 */
module.exports = async (req, res, next) => {
    if (!req.gid)
        return next({
            status: 401,
            message: `GameId required for Games client!`
        });

    let game = await games.getGameById(req.gid);
    if (!game)
        return next({
            status: 401,
            message: `Game does not exist!`
        });

    req.game = game;
    return next();
}