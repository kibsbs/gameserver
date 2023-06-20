/**
 * Service configuration
 */

module.exports.HTTP_PORT = 3000;
module.exports.HTTPS_PORT = 3443;
module.exports.FQDN = `gs-jmcs.lgc.danceparty.lol`; // Service's FQDN

module.exports.SSL = false; // Enable SSL
// Path to certificates, ex: "/etc/letsencrypt/live/hello.com/privkey.pem"
module.exports.SSL_PK = `/etc/letsencrypt/live/${this.FQDN}/privkey.pem`;
module.exports.SSL_CERT = `/etc/letsencrypt/live/${this.FQDN}/cert.pem`;
module.exports.SSL_CA = `/etc/letsencrypt/live/${this.FQDN}/chain.pem`;

module.exports.CONSTANTS = {

    // JDWall config
    // (AsyncChallenges and GlobalMessages were found from RE)
    JDWall_Service: {
        // Challenge messages
        AsyncChallenges: {
            refresh_time: 120,
            max_msg: 5
        },
        // Global messages (We don't know what it is)
        GlobalMessages: {
            refresh_time: 120,
            max_msg: 5
        },
        // Friends Autodance config
        FriendsUGC: {
            refresh_time: 120,
            max_msg: 5
        }
    }

};