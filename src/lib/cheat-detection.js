class CheatDetection {
    constructor() {
        this.db = require("./models/cheaters");
    }

    async isUserBanned(userOrProfileId) {
        return this.db.exists({
            $or: [{ profileId: userOrProfileId }, { userId: userOrProfileId }]
        }) ? true : false;
    }
}

module.exports = new CheatDetection();