class Games {
    constructor() {
        let games = global.gs.GAMES;
        this.games = [];

        // Turn games object to an array and append key as "version"
        Object.keys(games).forEach(k => {
            this.games.push({
                ...games[k],
                version: k
            })
        });
    }

    getGameByVersion(version) {
        return this.games.filter(g => g.version == version)[0] || null;
    }

    getGameById(id) {
        return this.games.filter(g => g.version == version)[0] || null;
    }
}

module.exports = new Games();