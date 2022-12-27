const axios = require("axios")

class JeanMichClient {

    constructor() {
        this.server = global.config.jeanmich.url
        if (!this.server) return;
    }

    async getDancerProfile(userId) {
        try {
            const profile = await axios({
                method: "GET",
                url: `${this.server}/DancerCard/RequestDancerProfile`,
                params: { userId }
            })
            return profile.data
        }
        catch(err) {
            return new Error(err)
        }
    }

}

module.exports = new JeanMichClient();