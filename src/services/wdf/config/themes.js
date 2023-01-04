const durations = require("./durations");

module.exports = [{
    id: 0,
    name: "classic",
    durations: {
        preSong: [],
        postSong: []
    },
    isAvailable: false
}, {
    id: 1,
    name: "community",
    desc: "Players pick a side and win as a team",
    durations: {
        preSong: [
            durations.community_choice_duration,
            durations.presentation_duration
        ],
        postSong: [
            durations.waiting_recap_duration,
            durations.community_result_duration,
            durations.session_result_duration,
            durations.world_result_duration
        ]
    },
    isAvailable: true
}, {
    id: 2,
    name: "vote",
    durations: {
        preSong: [],
        postSong: []
    },
    isAvailable: false
}, {
    id: 3,
    name: "coach",
    desc: "Players pick a coach on non-solo maps and win as a team",
    durations: {
        preSong: [],
        postSong: []
    },
    isAvailable: true
}, {
    id: 4,
    name: "starchallenge",
    durations: {
        preSong: [],
        postSong: []
    },
    isAvailable: false
}];