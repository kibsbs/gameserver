const uenc = require("uenc")

const session = require("jd-session")

module.exports = {

    name: `getServerTime`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const { nr_players, player_sid, sid_list } = req.body

        // Get all sessions from requester's game excluding requester's session
        session.db.aggregate([
            {
                $match: { sessionId: { $ne: req.sessionId }}
            },
            { 
                $sample: { 
                    size: nr_players 
                } 
            }
        ], async function (err, sessions) {
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

            // Amount of sessions in clients version excluding client
            const sessionCount = await session.db.count({
                version: req.version,
                sessionId: { $ne: req.sessionId }
            })

            return res.uenc({
                player_name: req.player.name,
                
                ...uenc.setIndex(sessions),
        
                nr_players: sessions.length,
                nr_asked: nr_players,
        
                count: sessionCount
            })


        });



    }
}