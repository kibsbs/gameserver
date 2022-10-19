const utils = require("utils")

const playlistLib = require("jd-playlist")
const session = require("jd-session")

module.exports = {

    name: `checkToken`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, /* next */) {

        const { lang } = req.body

        const now = Date.now()

        const playlist = new playlistLib(req.version)

        const themes = playlist.getThemes()
        const durations = playlist.getDurations()

        // Current and next song info
        const { current, next } = await playlist.getPlaylist()

        // Current and next theme info
        const themeType = current.theme.themeType
        const nextThemeType = next.theme.themeType

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
            vote_end: current.last_vote_time,
            next1: 0,
            next2: 0,
            next3: 0,
            next4: 0
        }

        let modeData = {
            mode: themeType,
            nextmode: nextThemeType,
        }

        let timingData = {
            start: current.start_song_time,
            end: current.stop_song_time,

            pos: (now - current.start_song_time) / 1000,
            left: (current.stop_song_time - now) / 1000,

            sessionToWorldResultTime: (durations.world_result_duration) / 1000,
            display_next_song_time: (durations.display_next_song_duration) / 1000,
            session_recap_time: (durations.session_result_duration) / 1000,

            theme_choice_duration: 0,
            theme_result_duration: 0,
            coach_choice_duration: 0,
            coach_result_duration: 0,

            rankwait: (durations.waiting_recap_duration) / 1000
        }

        let playlistData = {
            ...modeData,
            ...timingData,
            ...voteData,

            unique_song_id: current.song.id,
            nextsong: next.song.id,

            requestPlaylistTime: current.request_playlist_time,
            interlude: "yes"
        }

        // Depending on theme type, set extra information.
        switch (themeType) {
            case 1:
                playlistData.community1name = current.community1name
                playlistData.community2name = current.community2name
                playlistData.theme_choice_duration = (durations.community_choice_duration) / 1000
                playlistData.theme_result_duration = (durations.community_result_duration) / 1000
                break;
            case 2:
                break;
            case 3:
                playlistData.coach_choice_duration = (durations.coach_choice_duration) / 1000
                playlistData.coach_result_duration = (durations.coach_result_duration) / 1000
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