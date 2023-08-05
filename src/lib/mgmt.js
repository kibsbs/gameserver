const axios = require("axios");

class MGMT {
    constructor() {
        this.url = (process.env.MGMT_URL || "http://127.0.0.1:1337");
        this.token = global.secrets.MGMT_TOKEN;
        this.headers = {
            Authorization: "Bearer " + this.token
        };
    };

    async getShopSongs() {
        try {
            const { data: songs } = await axios({
                method: "GET",
                url: this.url + "/api/songs?populate=*",
                headers: this.headers
            });
            return songs.data;
        }
        catch(err) {
            throw new Error(`Cannot fetch shop songs: ${err}`);
        };
    };

};

module.exports = new MGMT();