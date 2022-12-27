class Utils {

    constructor() {}

    canPlayerConnect(ticketData) {

        if (!ticketData) return [false, "No ticket"];

        let games = global.config.games
        let gameId = ticketData.gid

        if (!gameId) return [false, "No gameId provided in ticket"]
        if (!games[gameId]) return [false, "Ticket gameId isn't available in config"]

        if (games[gameId] && !games[gameId].isAvailable) return [false, "GameId exists but disabled by devs"]

        return [true, ""]
    }

}

module.exports = new Utils();