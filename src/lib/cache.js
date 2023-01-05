class Cache {
    constructor() {
        this.m = global.memcached;
    }

    async set(key, value, options = {}) {
        value = JSON.stringify(value);
        return await this.m.set(key, value, options);
    }

    async get(key) {
        const { value } = await this.m.get(key);
        try {
            return JSON.parse(value);
        }
        catch(err) {
            if (!err) return null;
            throw new Error(err);
        }
    }
}

module.exports = new Cache();