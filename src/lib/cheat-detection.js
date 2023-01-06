class CheatDetection {
    constructor() {
        this.db = require("./models/cheaters");
    }

    async banUser(data) {
        try {
            const entry = new this.db(data);
            return await entry.save()
        }
        catch(err) {
            throw new Error(`Couldn't register cheat ${JSON.stringify(data)}: ${err}`)
        }
    }

    async isUserBanned(userOrProfileId) {
        return this.db.exists({
            $or: [{ profileId: userOrProfileId }, { userId: userOrProfileId }]
        }) ? true : false;
    }
}

module.exports = new CheatDetection();