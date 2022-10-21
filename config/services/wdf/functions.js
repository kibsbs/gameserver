module.exports = {
    checkToken: {
        id: 1023,
        sessionRequired: false,
        tokenRequired: true,
        pingSession: false
    },
    connectToWDF: {
        id: 1166,
        sessionRequired: false,
        tokenRequired: true,
        pingSession: false
    },
    disconnectFromWDF: {
        id: 1695,
        sessionRequired: true,
        tokenRequired: true,
        pingSession: false
    },
    getBloomBergs2: {
        id: 1374,
        sessionRequired: false,
        tokenRequired: true,
        pingSession: false
    },
    getMyRank: {
        id: 914,
        sessionRequired: true,
        tokenRequired: true,
        pingSession: true
    },
    getPlayListPos: {
        id: 1444,
        sessionRequired: false,
        tokenRequired: true,
        pingSession: false
    },
    getPlayerScores: {
        id: 1564,
        sessionRequired: true,
        tokenRequired: true,
        pingSession: true
    },
    getRandomPlayers: {
        id: 1665,
        sessionRequired: true,
        tokenRequired: true,
        pingSession: true
    },
    getRandomPlayersWMap: {
        id: 2038,
        sessionRequired: true,
        tokenRequired: true,
        pingSession: false
    },
    getServerTime: {
        id: 1350,
        sessionRequired: false,
        tokenRequired: false,
        pingSession: false
    }
}