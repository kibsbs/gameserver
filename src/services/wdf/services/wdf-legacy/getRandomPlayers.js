const Session = require("wdf-session");
const uenc = require("uenc");

module.exports = {

    name: `getRandomPlayers`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const { nr_players, player_sid, sid_list } = req.body;

        // If sid_list is empty, return all players in lobby
        // If sid_list is not empty, filter players in lobby with sids in the list

        const session = new Session(req.game.version);

        // Exclude client's sid from lobby sids
        let lobbySessionIds = req.lobby.sessions.filter(sid => sid !== req.sid);

        // If "sid_list" has ids in it, filter lobby's sids with it
        if (sid_list.length > 0) 
            lobbySessionIds = lobbySessionIds.filter(sid => sid_list.includes(sid));

        const sessions = await session.getManySessions({
            sessionId: lobbySessionIds
        });
        const sessionsMap = sessions.map(p => {
            return {
                sid: p.sessionId,
                name: p.profile.name,
                pays: p.profile.country,
                avatar: p.profile.avatar,
                onlinescore: p.profile.rank,
            }
        });

        return res.uenc({
            player_name: req.profile.name,

            ...uenc.setIndex(sessionsMap),

            nr_players: sessions.length,
            nr_asked: nr_players,
            count: await session.sessionCount()
        });
    }
}