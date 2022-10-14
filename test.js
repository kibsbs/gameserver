const db = require("./services/wdf/models/lobby")

global.logger = require("./libs/logger")(["test"])

require("./clients/db-client")(require("./config/services/wdf"), async (err, ok) => {

    let maxSessions = 8
    const lobby = await db.findOne({
        version: 2018,
        $where: `${maxSessions}>this.sessions.length`
    });

    await lobby.updateOne({
        version: 2018,
        $push: { sessions: "2" }
    })

})