module.exports = {

    env: global.ENV || "local",
    port: 9000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    maxScore: 13333,

    database: require("./database")[global.ENV],
    redis: require("./redis")[global.ENV],

    playlist: require("./playlist"),

    constants: require("./constants"),
    secrets: require("./secrets"),
    lobby: require("./lobby"),
    functions: require("./functions"),

    games: require("../../games"),

    ...require("./envs")[global.ENV]
}