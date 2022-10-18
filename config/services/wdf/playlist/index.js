module.exports = {

    communities: {
        list: require("./communities/list.json"),
        locs: require("./communities/locs.json")
    },
    timings: require("./timings"),
    themes: [
        {},
        {
            id: 1,
            themeName: "community",
            isAvailable: true
        },
        {
            id: 2,
            themeName: "vote",
            isAvailable: false
        },
        {
            id: 3,
            themeName: "coach",
            isAvailable: true
        },
        {
            id: 4,
            themeName: "starChallenge",
            isAvailable: false
        }
    ]

}