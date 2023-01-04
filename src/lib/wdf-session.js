const cheatDetection = require("cheat-detection");

class Session {
    constructor() {}

    new() {}

    async canUserConnect(userOrProfileId) {
        let isBanned = await cheatDetection.isUserBanned(userOrProfileId);
        return (isBanned);
    }
}

module.exports = new Session();