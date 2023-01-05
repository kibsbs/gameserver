
module.exports = {

    name: `getRandomPlayers`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const { nr_players, player_sid, sid_list } = req.body

        // Get sessions of client's lobby players excluding client
        session.db.find({
            sessionId: { $ne: req.sessionId },
            lobbyId: req.lobbyId
        }, async function (err, sessions) {
            if (err) {
                return next({
                    status: 500,
                    message: `Error occured: ${err}`
                })
            }

            // Map session result to shortcut
            sessions = sessions.map(p => {
                return {
                    sid: p.sessionId,
                    name: p.player.name,
                    pays: p.player.country,
                    avatar: p.player.avatar,
                    onlinescore: p.player.onlinescore,
                }
            })

            return res.uenc({
                player_name: req.player.name,
                
                ...uenc.setIndex(sessions),
        
                nr_players: sessions.length,
                nr_asked: nr_players,
        
                count: await session.count(req.version)
            })

        });



    }
}