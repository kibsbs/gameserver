
const fs = require("fs")

const time = require("time")
const utils = require("utils")
const songs = require("jd-songs")

function isEmpty(obj) {
    return obj == null || Object.keys(obj).length === 0
}
let playlist = {}
let history = []

function schedule(epoch, fn) {
    let now = time.secondsDouble()
    let timeout = (epoch - now) * 1000
    console.log("Scheduled work for", now, epoch, timeout)
    return setTimeout(fn, timeout);
}

class Playlist {

    constructor(version) {
        this.version = Number(version);

        if (!playlist[this.version]) playlist[this.version] = {
            previous: null,
            current: null,
            next: null
        }

        this.p = playlist[this.version]

        this.themes = global.config.playlist.themes
        this.timings = global.config.playlist.timings
        this.communities = global.config.playlist.communities
    }

    getThemes() {
      return this.themes
    }

    getTimings() {
      return this.timings
    }

    isNext() {
        if (!this.p.next && this.p.current) return true
        else return false
    }

    getRandomCommunity() {
        let cms = this.communities.list
        let randomCm = cms[Math.floor(Math.random()*cms.length)]
        return randomCm
    }

    getRandomTheme(ignoredTheme = 0) {
        let themes = this.themes.filter(t => t.isAvailable && ignoredTheme !== t.id)
        let randomTheme = themes[Math.floor(Math.random() * themes.length)]
        return randomTheme;
    }

    async rotateScreens() {
        this.p.previous = this.p.current
        this.p.current = this.p.next
        this.p.next = await this.createScreen("next")
    }

    async getScreens() {

        let previous = this.p.previous
        let current = this.p.current
        let next = this.p.next

        if (isEmpty(current)) {
            this.p.current = await this.createScreen("current")
        }

        if (isEmpty(next)) {
            this.p.next = await this.createScreen("next")
        }

        return this.p
    }

    async createScreen(type) {

        let now = time.secondsDouble()
        let newStepTime = 0

        let isNext
        let ignoredTheme = 0
        let ignoredSongs = []

        let previous = this.p.previous
        let current = this.p.current
        let next = this.p.next

        // Depending on type we filter out ignored theme and songs
        // If screen is "current", filter out previous's theme and song
        // If screen is "next", filter out previous and current's theme and song
        // so that there is no duplicating (a song being played over 2-3 times)
        switch(type) {
            case "current":
                ignoredTheme = this.p.previous ? this.p.previous.themeType : null
                ignoredSongs = [this.p.previous ? this.p.previous.mapName : null]
                break;
            case "next":
                ignoredTheme = this.p.current ? this.p.current.themeType : null
                ignoredSongs = [this.p.previous ? this.p.previous.mapName : null, this.p.current ? this.p.current.mapName : null]
                break;
        }

        // Get a random theme but make sure we ignore previous screen's theme
        // (because appearently themes should be unique for each screen)
        // (if current/next has the same themetype wdf crashes in game(?))
        let theme = this.getRandomTheme(ignoredTheme)

        // Depending on the random theme we got we need to filter out songs
        let songFilter = {}
        switch(theme.id) {

            // Coach selection theme must filter songs with 
            // coachcount higher than 1 (so that players can choose a coach)
            case 3:
                songFilter = { numCoach: { $gt: 1 } }
                break;
        }

        // Fetch a random song
        let song = await songs.getRandomSong({
            jdVersion: this.version,
            mapName: { $nin: ignoredSongs },
            ...songFilter
        });

        if (isEmpty(song)) {
            throw new Error(`Couldn't fetch a random map for version ${this.version}`)
        }

        // If we are creating screen for "next" we need to get "current"'s time as base
        if (current && current.timing) {
            console.log("1", song.mapName)

            // If "next" theme is vote, use "current" requestPlaylistTime as base
            if (this.isThemeVote(theme.id)) {
                newStepTime = current.timing.requestPlaylistTime
            }
            // By default use "current" worldResultEnd base
            else if (current.timing.worldResultEnd) {
                newStepTime = current.timing.worldResultEnd
            }

            isNext = true
        }
        // If all screens are empty use date.now() as base
        else {
            console.log("2", song.mapName)
            newStepTime = now
            isNext = false
        }

        let screen = {
            themeType: theme.id,
            themeName: theme.name,

            mapName: song.mapName,
            mapLength: time.round(song.mapLength / 1000),
            uniqueSongId: song.uniqueSongId,
        }

        // Get all screen durations for screen
        let timing = this.calculateTime(newStepTime, screen, isNext)
        screen.timing = timing

        // Depending on theme add additional info such as vote options and theme selection
        switch (theme.id) {

            // If theme is community, we get a random community and append it to query.
            case 1:
                let community = this.getRandomCommunity() || ["Devd", "Rama"]
                screen = {
                    ...screen,
                    community1name: community[0],
                    community2name: community[1]
                }
                break;

            // If theme is vote, we get a random number between 2 and 4, and then 
            // get that amount of random maps to vote for.
            case 2:
                let voteAmount = Math.floor(Math.random() * 3) + 2 // Min 2 Max 4
                
                // Get "voteAmount" amount of random maps 
                let randomVoteSongs = await songs.getRandomSong({ jdVersion: this.version }, voteAmount)
                screen = {
                    ...screen,
                    voteOptions: randomVoteSongs
                }
                break;

        }

        // Schedule the next rotation
        schedule(screen.timing.playlistComputation, async () => {
            console.log("\n")
            console.log("!!!! SONG ENDED songEnd:", screen.timing.songEnd, "now:", Date.now())
            console.log("Current playlist:")
            console.log(this.p)
            console.log("\n!!! Rotating...\n")
            await this.rotateScreens()
            console.log("Rotated Current playlist:")
            console.log(this.p)
        });

        return screen
    }

    calculateTime(newStepTime, screen, isNext = false) {

        let themeType = screen.themeType

        let presentationStart = newStepTime + this.computePreSongDuration(themeType)

        let songStart = presentationStart + this.timings["presentation_duration"]
        // We round the mapLength and keep only the last 3 digits
        // 163176.29166666666 -> 163176.291 (YouNeverCan)
        // 198100.6875 -> 198100.687 (UnderTheSea)
        let mapLength = screen.mapLength
        let songEnd = time.round(songStart + mapLength)

        let recapStart = songEnd + this.timings["waiting_recap_duration"]
        let sessionResultStart = recapStart + this.computeThemeResultDuration(themeType)
        let sessionToWorldResultTime = sessionResultStart + this.timings["session_result_duration"]
        let worldResultEnd = sessionToWorldResultTime + this.timings["world_result_duration"]

        let playlistComputation
        let lastVote
        let preComputeTime
        let secondRequestPlaylistTime

        if (isNext && this.isThemeVote(themeType)) {
            // Compute last_vote_time
            lastVote = worldResultEnd + this.timings["vote_choice_duration"]

            // Playlist computation time
            playlistComputation = lastVote + this.timings["vote_computation_delay"]

            // schedule an playlist update at the end of world recap
            preComputeTime = worldResultEnd - this.timings["playlist_request_delay"] - this.timings["playlist_computation_delay"]
            secondRequestPlaylistTime = lastVote + this.timings["vote_computation_delay"] + this.timings["playlist_computation_delay"]

        }
        else {
            if (isNext && this.isThemeStarChallenge(themeType)) {
                lastVote = worldResultEnd + this.timings["star_challenge_intro_duration"]
            }

            else {
                // last_vote_time should not be used, but we put a valid time to keep the same chronolo order.
                lastVote = worldResultEnd

                // Compute playlist_computation_time
                playlistComputation = worldResultEnd - this.timings["playlist_request_delay"] - this.timings["playlist_computation_delay"]
            }
        }

        // Compute request_playlist_time
        let requestPlaylistTime = worldResultEnd // - this.timings["playlist_request_delay"]

        // Compute unlock_computation_time and request_unlock_time
        let unlockComputation = songEnd + this.timings["send_stars_delay"]
        let requestUnlockTime = unlockComputation + this.timings["unlock_computation_delay"]

        let timing = {
            newStepTime,
            presentationStart,
            songStart,
            songEnd,
            recapStart,
            sessionResultStart,
            sessionToWorldResultTime,
            worldResultEnd,
            lastVote,
            requestUnlockTime,
            playlistComputation,
            requestPlaylistTime
        }

        return timing

    }

    computePreSongDuration(themeType) {
        if (this.isThemeVote(themeType))
            return this.timings["vote_result_duration"]
        else if (this.isThemeCommunity(themeType)) {
            return this.timings["community_choice_duration"]
        }
        else if (this.isThemeCoach(themeType)) {
            return this.timings["coach_choice_duration"]
        }
        else if (this.isThemeStarChallenge(themeType)) {
            return this.timings["star_challenge_intro_duration"]
        }
        else {
            return 0
        }
    }

    computeThemeResultDuration(themeType) {
        if (this.isThemeAutodance(themeType))
            return this.timings["autodance_result_duration"]
        else if (this.isThemeCommunity(themeType)) {
            return this.timings["community_result_duration"]
        }
        else if (this.isThemeCoach(themeType)) {
            return this.timings["coach_result_duration"]
        }
        else if (this.isThemeStarChallenge(themeType)) {
            return this.timings["star_challenge_outro_duration"]
        }
        else {
            return 0
        }
    }

    isThemeAutodance(theme) {
        return theme == 0
    }

    isThemeCommunity(theme) {
        return theme == 1
    }

    isThemeVote(theme) {
        return theme == 2
    }

    isThemeCoach(theme) {
        return theme == 3
    }

    isThemeStarChallenge(theme) {
        return theme == 4
    }

}

module.exports = Playlist;