const scheduler = require('cron');
const fs = require("fs");

class Playlist {
    constructor(version) {
        this.version = version;
        this.durations = global.config.DURATIONS;
        this.themes = global.config.THEMES;
    }
}