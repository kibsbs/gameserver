const utils = require("utils")

const playlists = require("jd-playlist")
const session = require("jd-session")

module.exports = {

    name: `checkToken`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, /* next */) {

        const { lang } = req.body

        let now = Date.now()

        const playlist = new playlists(req.version)

        const themes = playlist.getThemes()
        const timings = playlist.getTimings()

        // Current and next song info
        const { previous, current, next } = await playlist.getScreens()

        let modeData = {
            mode: current.themeType,
            nextmode: next.themeType,
        }

        now += now - current.timing.newStepTime

        let pos = (now - current.timing.songStart) / 1000
        let left = (current.timing.songEnd - now) / 1000

        let timingData = {
            start: current.timing.songStart,
            end: current.timing.songEnd,
            pos,
            left,

            sessionToWorldResultTime: (timings.world_result_duration) / 1000,
            display_next_song_time: (timings.display_next_song_duration) / 1000,
            session_recap_time: (timings.session_result_duration) / 1000,

            theme_choice_duration: 0,
            theme_result_duration: 0,
            coach_choice_duration: 0,
            coach_result_duration: 0,

            rankwait: (timings.waiting_recap_duration) / 1000
        }

        let voteData = {
            vote1: 0,
            vote2: 0,
            vote3: 0,
            vote4: 0,
            votenumresult: 0,
            vote1_song: 0,
            vote2_song: 0,
            vote3_song: 0,
            vote4_song: 0,
            votenumchoices: 0,
            vote_end: current.timing.lastVote,
            next1: 0,
            next2: 0,
            next3: 0,
            next4: 0
        }

        let playlistData = {
            ...modeData,
            ...timingData,
            ...voteData,

            unique_song_id: current.uniqueSongId,
            nextsong: next.uniqueSongId,

            requestPlaylistTime: current.timing.requestPlaylistTime,
            interlude: "yes"
        }

        // Depending on theme type, set extra information.
        switch (current.themeType) {
            case 1:
                playlistData.community1name = current.community1name
                playlistData.community2name = current.community2name
                playlistData.theme_choice_duration = (timings.community_choice_duration) / 1000
                playlistData.theme_result_duration = (timings.community_result_duration) / 1000
                break;
            case 2:
                break;
            case 3:
                playlistData.coach_choice_duration = (timings.coach_choice_duration) / 1000
                playlistData.coach_result_duration = (timings.coach_result_duration) / 1000
                break;
        }

        // Times to parse
        ["start", "end", "requestPlaylistTime", "vote_end"].forEach(t => {
            playlistData[t] = utils.getServerTime(playlistData[t])
        });

        return res.uenc({
            ...playlistData,
            count: await session.count(req.version),
            t: utils.getServerTime(now)
        })

    }
}