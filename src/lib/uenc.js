class Serializer {

    constructor() {}

    client(req, res, next) {
        return require("./uenc-client")(req, res, next)
    }

    serialize(data = {}, joinBy = "&") {
        return Object.entries(data).map(([k, v]) => `${k}=${v}`).join(joinBy)
    }

    serializeWdf(data = [], index = false, indexOffset = 0) {
        // each entry in an array [{user: "Hello"}, {user:"testname"}]
        // will have indexes like this user0=Hello&user1=Hello
        let result = []
        data.forEach((obj, i) => {
            result.push(Object.entries(obj).map(([k, v]) => `${k}${i+indexOffset}=${v}`).join(";"))
        })
        return result.join(";")
    }

    unserialize(string = "hello=true") {
        string = string.includes(";") ? string.split(";") : string.split("&")
        let obj = {}
        string.map(a => obj[a.split("=")[0]] = a.split("=")[1])
        return obj
    }

    setIndex(data = [ data ], indexOffset = 0, seperator = "") {
        let result = {}
        data.forEach((obj, i) => {
            i += indexOffset
            Object.entries(obj).map(([k, v]) => {
                result[`${k}${seperator}${i}`] = v
            })
            i = 0
        })
        return result
    }

}

module.exports = new Serializer();