const songs = require("jd-songs");
const score = require("jd-scores");

class Playlist {

  constructor(version) {
    this.version = Number(version)

    this.db = require("redis-helper")
    
    this.communities = global.config.playlist.communities
    this.themes = global.config.playlist.themes
    this.timings = global.config.playlist.timings
  }
  
  // ----------------------
  // Redis Helper functions
  async getLastSong() {
    return await this.db.getLastSong(this.version)
  }

  async getCurrentSong() {
    return await this.db.getCurrentSong(this.version)
  }

  async getNextSong() {
    return await this.db.getNextSong(this.version)
  }
  // ----------------------

  getThemes() {
    return this.themes
  }

  getDurations() {
    return this.timings
  }

  async getMapLength(mapName) {
    let songdesc = await songs.get({ mapName });
    return parseInt(songdesc.mapLength)
  }

  async isNext() {
    const current = await this.getCurrentSong()
    const next = await this.getNextSong()
    if (!next && current) return true
    else return false
  }

  async getRandomMap(filter = {}, amount = 1) {
    try {
      let randomMap = await songs.getRandomMap({
        ...filter,
        jdVersion: this.version
      }, amount)

      if (!randomMap) throw new Error(`Couldn't fetch random map for ${this.version}`)

      return randomMap
    }
    catch(err) {
      throw new Error(`Error occured while trying to get a random map: \n${err}`)
    }
  }

  async getRandomMaps(amount, filter = []) {
    return await this.getRandomMap(filter, amount)
  }

  getRandomTheme() {
    let themes = this.themes.filter(t => t.isAvailable) // first filter themes that arent available
    let randomTheme = themes[Math.floor(Math.random()*themes.length)]
    return randomTheme;
  }

  getRandomCommunity() {
    let cms = this.communities.list
    let randomCm = cms[Math.floor(Math.random()*cms.length)]
    return randomCm
  }

  async getScreenType() {

    const playlistData = await this.getPlaylist(false)
    const current = playlistData.current

    const start = current.start_song_time
    const end = current.stop_song_time

    if (Date.now() > start && Date.now() < end) {
      return "song"
    }
    else {
      return "recap"
    }

  }

  // Playlist queue logic
  async populateQueue() {
    for (let count = await this.db.getQueueSize(this.version); count < 2; count++) {
      await this.db.pushSong(this.version, await this.createPlaylist(count));
    }
  }

  async getPlaylist(update = true) {

    if (!update) {
      return {
        current: await this.getCurrentSong(),
        next: await this.getNextSong()
      }
    }
    
    const current = await this.getCurrentSong();
    const now = Date.now() / 1000

    if (update && current && current.request_playlist_time < now) {
      console.log("POPPED SONG", current, current.request_playlist_time, now)
      await this.db.popSong(this.version);
      await this.scores.eraseScores();
    }

    await this.populateQueue(this.version);

    return {
      current: await this.getCurrentSong(),
      next: await this.getNextSong()
    }
  }
  // --


  async createPlaylist(count) {

    const now = Date.now()
    const { id: themeType, themeName } = this.getRandomTheme()

    let mapsFilter = {};

    switch(themeType) {
      // If our mode is classic, we only allow solo maps.
      case 0:
        mapsFilter = { numCoach: 1 }
        break;

      // If our mode is coach selection, we can't allow solo maps.
      case 3:
        mapsFilter = { numCoach: { $gt: 1 } }
        break;
    }

    const { map, mapName, mapLength, uniqueSongId } = await this.getRandomMap(mapsFilter)
    const latest = await this.getLastSong()
    
    const isNext = count == 1 ? true : false

    let newStepTime

    if (isNext && latest && latest.request_playlist_time && this.isThemeVote(themeType)) {
      newStepTime = latest.request_playlist_time
    }
    else if (isNext && latest && latest.request_playlist_time) {
      newStepTime = latest.request_playlist_time
    }
    else {
      newStepTime = now
    }

    // Make sure that the newStepTime is bigger than the timestamp (can happen if the server sleeps for a while)
    if (newStepTime < now)
      newStepTime = now

    // Compute presentation_start_time
    let presentation_start_time = newStepTime + this.computePreSongDuration(themeType)

    // Compute start_song_time
    let start_song_time = presentation_start_time  + this.timings["presentation_duration"]

    // Compute stop_song_time
    let stop_song_time = start_song_time + await this.getMapLength(mapName)

    // Compute recap_start_time
    let recap_start_time = stop_song_time + this.timings["waiting_recap_duration"]
            
    // Compute session_result_start_time
    let session_result_start_time = recap_start_time + this.computeThemeResultDuration(themeType)
    
    // Compute session_to_world_result_time
    let session_to_world_result_time = session_result_start_time + this.timings["session_result_duration"]

    // Compute world_result_stop_time
    let world_result_stop_time = session_to_world_result_time + this.timings["world_result_duration"]
          
    let merge_computation_time = session_to_world_result_time + this.timings["world_result_duration"] / 4
    let merge_computation_duration_in_ms = this.timings["world_result_duration"] / 2

    let playlist_computation_time
    let last_vote_time
    let pre_compute_time
    let second_request_playlist_time

    if (isNext && this.isThemeVote(themeType)) {
      // Compute last_vote_time
      last_vote_time = world_result_stop_time + this.timings["vote_choice_duration"]

      // Playlist computation time
      playlist_computation_time = last_vote_time + this.timings["vote_computation_delay"]

      // schedule an playlist update at the end of world recap
      pre_compute_time = world_result_stop_time - this.timings["playlist_request_delay"] - this.timings["playlist_computation_delay"]
      second_request_playlist_time = last_vote_time + this.timings["vote_computation_delay"] + this.timings["playlist_computation_delay"]

    }
    else {
      if (isNext && this.isThemeStarChallenge(themeType)) {
        last_vote_time = world_result_stop_time + this.timings["star_challenge_intro_duration"]
      }
        
      else {
        // last_vote_time should not be used, but we put a valid time to keep the same chronolo order.
        last_vote_time = world_result_stop_time

        // Compute playlist_computation_time
        playlist_computation_time = world_result_stop_time - this.timings["playlist_request_delay"] - this.timings["playlist_computation_delay"]
      }
    }

    // Compute request_playlist_time
    let request_playlist_time = world_result_stop_time // - this.timings["playlist_request_delay"]
        
    // Compute unlock_computation_time and request_unlock_time
    let unlock_computation_time = stop_song_time + this.timings["send_stars_delay"]
    let request_unlock_time = unlock_computation_time + this.timings["unlock_computation_delay"]

    let timing = {
      "presentation_start_time": presentation_start_time, 
      "start_song_time": start_song_time, 
      "stop_song_time": stop_song_time, 
      "recap_start_time": recap_start_time, 
      "session_result_start_time": session_result_start_time, 
      "session_to_world_result_time": session_to_world_result_time, 
      "world_result_stop_time": world_result_stop_time, 
      "last_vote_time": last_vote_time, 
      "request_unlock_time": request_unlock_time, 
      "reset_score_time": playlist_computation_time, 
      "request_playlist_time": request_playlist_time 
    }

    let query = {
      ...timing,
      version: this.version,
      theme: {
        themeType,
        themeName
      },
      length: mapLength,
      song: {
        mapName,
        id: uniqueSongId
      }
    }

    switch(themeType) {

      // If theme is community, we get a random community and append it to query.
      case 1:
        let community = this.getRandomCommunity() || ["Devd", "Rama"]
        query = {
          ...query,
          community1name: community[0],
          community2name: community[1]
        }
        break;
      
      // If theme is vote, we get a random number between 2 and 4, and then 
      // get that amount of random maps to vote for.
      case 2:
        let voteAmount = Math.floor(Math.random() * 3) + 2 // Min 2 Max 4
        let randomVoteSongs = this.getRandomMaps(voteAmount) // Get "voteAmount" amount of random maps 
        query = {
          ...query,
          votes: randomVoteSongs.map((song, i) => { return { [song.uniqueSongId]: 0 } })
        }
        break;

    }

    return query;

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

module.exports = Playlist