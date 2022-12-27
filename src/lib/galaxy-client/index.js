const axios = require("axios")

class GalaxyClient {

    constructor(serverUrl) {

        switch(global.ENV) {
            case "prod":
                this.url = "https://galaxy-api.danceparty.online"
                break;
            case "local":
                this.url = "http://localhost:5000"
                break;
        }

    }

    buildUrl(path) {
        return this.url + path
    }

    async getAllSongs(params = {}) {
        try {
            const songs = await axios({
                method: "GET",
                url: this.buildUrl("/songdb/v1/songs"),
                params
            })
            return songs.data
        }
        catch(err) {
            throw new Error(`Can't connect to Galaxy: ${err}`)
        }
    }

    async getSong(searchQuery) {
        try {
            const song = await axios({
                method: "GET",
                url: this.buildUrl("/songdb/v1/songs/" + searchQuery)
            })
            return song.data
        }
        catch(err) {
            throw new Error(`Can't connect to Galaxy: ${err}`)
        }
    }

}