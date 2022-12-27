module.exports = {

    communities: require("./communities.json"),
    timings: require("./timings"),
    themes: [
        {},
        {
            id: 1,
            name: "community",
            isAvailable: true
        },
        {
            id: 2,
            name: "vote",
            isAvailable: false
        },
        {
            id: 3,
            name: "coach",
            isAvailable: true
        },
        {
            id: 4,
            name: "starChallenge",
            isAvailable: false
        }
    ]

}