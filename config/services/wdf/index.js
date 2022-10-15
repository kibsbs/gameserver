module.exports = {

    port: 9000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    maxScore: 13333,

    database: require("./database")[global.ENV],
    redis: require("./redis")[global.ENV],

    constants: require("./constants"),
    secrets: require("./secrets"),
    timings: require("./timings"),
    lobby: require("./lobby"),
    functions: require("./functions"),

    games: require("../../games"),

    ...require("./envs")[global.ENV]
}