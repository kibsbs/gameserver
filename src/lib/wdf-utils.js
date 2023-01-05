

class WDFUtils {
    constructor() {}

    serverTime(now = Date.now()) {
        return (now - 1000000000000) / 1000;
    }

    formatTime() {}
}

module.exports = new WDFUtils();