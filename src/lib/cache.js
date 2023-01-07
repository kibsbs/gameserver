class Cache {
    constructor() {
        this.m = global.memcached;
    }

    async set(key, value, expires) {
        if (Array.isArray(value) || typeof value == "object")
            value = JSON.stringify(value);
        
        try {
            await this.m.set(key, value, { expires });
        }
        catch(err) {
            throw new Error(`Can't save ${key} to cache: ${err}`);
        }
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