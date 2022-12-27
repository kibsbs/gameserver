const crypto = require("crypto")

/**
 * NAS Token is for authorizing players.
 * The token is generated and returned from NAS and it's used by wiiDance services.
 * We have char limit of 150 and we can't use JWT, therefore we use ciphering.
 */
class NasToken {

    /**
     * Define all required keys
     */
    constructor() {
        this.secret = global.config.tokens.nasToken
        this.algorithm = "aes-256-cbc"
        this.vector = Buffer.from(this.secret.vector, "hex")
        this.securityKey = Buffer.from(this.secret.securityKey, "hex")
    }

    /**
     * Generates a token with given payload, if a payload isn't passed
     * it will generate token for a custom account.
     * @param {Object} payload - Payload
     * @returns {String} - Token
     */
    generate(payload = {
        uid: 432943924,
        gid: "SE3E",
        loc: 1,
        rgn: 1
    }) {
        return this.encrypt(payload)
    }

    /**
     * Verifies given token.
     * @param {String} token - Token to verify
     * @param {Function} cb - Callback
     * @returns 
     */
    verify(token, cb) {

        try {
            let payload = this.decrypt(token)
            return cb(null, payload)
        }
        catch(err) {
            return cb(err)
        }

    }

    /**
     * Decrypts given token and returns it as JSON.
     * @param {String} token - Token to decrypt 
     * @returns {Object} - Payload
     */
    decrypt(token) {

        token = decodeURIComponent(token)
        token = Buffer.from(token, "base64").toString("hex")

        const decipher = crypto.createDecipheriv(this.algorithm, this.securityKey, this.vector);

        let payload = decipher.update(token, "hex");
        payload += decipher.final("utf8");

        return JSON.parse(payload)

    }

    /**
     * Encrypts given payload.
     * @param {Object} payload - Payload to encrypt
     * @returns {String} - Token
     */
    encrypt(payload = {}) {

        payload.e = Date.now()
        payload = JSON.stringify(payload)

        const cipher = crypto.createCipheriv(this.algorithm, this.securityKey, this.vector);

        let token = cipher.update(payload, "utf-8", "hex");
        token += cipher.final("hex");
        token = Buffer.from(token, "hex").toString("base64")

        return token

    }

}

module.exports = new NasToken();