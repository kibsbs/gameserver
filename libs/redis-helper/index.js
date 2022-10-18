const PLAYLIST_KEY = (version) => `jd-playlist-${version}`
const SONGS_ORDER_KEY = (version) => `jd-songs-order-${version}`
const SONG_IDX_KEY = (version) => `jd-songs-idx-${version}`

class RedisHelper {

    constructor() {
        this.client = global.redisClient // Redis must be connected at the first line of the server code!

        if (!this.client) throw new Error(`Redis must be connected for redis helper to work!`)
    }

    run(...args) {
        return this.client.sendCommand(args.map(
            arg => typeof arg == "object" ? JSON.stringify(arg) : "" + arg
        ));
    }

    getQueueSize(version) {
        return this.run("LLEN", PLAYLIST_KEY(version));
    }

    async getCurrentSong(version) {
        return JSON.parse(await this.run("LINDEX", PLAYLIST_KEY(version), 0));
    }

    async getNextSong(version) {
        return JSON.parse(await this.run("LINDEX", PLAYLIST_KEY(version), 1));
    }

    async getLastSong(version) {
        return JSON.parse(await this.run("LINDEX", PLAYLIST_KEY(version), -1));
    }

    pushSong(version, song) {
        return this.run("RPUSH", PLAYLIST_KEY(version), song);
    }

    popSong(version) {
        return this.run("LPOP", PLAYLIST_KEY(version));
    }

    resetQueue(version) {
        return this.run("DEL", PLAYLIST_KEY(version));
    }

    // IN DEVELOPMENT
    // async incrementSongIdx() {
    //     const len = await this.run("LLEN", Redis.SONGS_ORDER_KEY);
    //     const idx = await this.run("GET", Redis.SONG_IDX_KEY) ?? 0;

    //     await this.run("SET", Redis.SONG_IDX_KEY, (idx + 1) % len);
    // }

    // async getRandomSongId() {
    //     const song_ids = await this.run("GET", Redis.SONGS_ORDER_KEY) ?? [];
    //     const idx = this.run("GET", Redis.SONG_IDX_KEY) ?? 0;

    //     await this.incrementSongIdx();

    //     return song_ids[idx];
    // }

    // async setSongsOrder(song_ids) {
    //     await this.run("SET", Redis.SONG_IDX_KEY, 0);
    //     await this.run("SET", Redis.SONGS_ORDER_KEY, song_ids);
    // }
}

module.exports = new RedisHelper();