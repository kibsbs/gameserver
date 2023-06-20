/**
 * Service configuration
 */

module.exports.HTTP_PORT = 9000;
module.exports.HTTPS_PORT = 9443;
module.exports.FQDN = `gs-wdf.lgc.danceparty.lol`; // Service's FQDN

module.exports.SSL = false; // Enable SSL
// Path to certificates, ex: "/etc/letsencrypt/live/hello.com/privkey.pem"
module.exports.SSL_PK = `/etc/letsencrypt/live/${this.FQDN}/privkey.pem`;
module.exports.SSL_CERT = `/etc/letsencrypt/live/${this.FQDN}/cert.pem`;
module.exports.SSL_CA = `/etc/letsencrypt/live/${this.FQDN}/chain.pem`;

module.exports.COMMUNITIES = require("./config/communities");
module.exports.DURATIONS = require("./config/durations");
module.exports.THEMES = require("./config/themes");

module.exports.HAPPYHOUR = {
    time: 1674502588554,
    duration: 3600000
};

// Temporary unlocked songs
module.exports.LOCKED = {
    starCountToUnlock: 500000,
    lastSong: 25259885272, // ItsYouSWT (testing if alts need to be last unlocked to be played by game)
    nextSong: 21624006940 // PrinceAli (also unavailable in songdb)
};