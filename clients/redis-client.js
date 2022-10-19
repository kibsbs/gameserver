
const redis = require("redis");

module.exports = async function(config, callback) {

    if (!config.redis) throw new Error('Redis config is not defined.');

    logger.info(`Trying to connect to Redis...`)

    

    try {
        const client = redis.createClient(config.redis);

        await client.connect();

        global.logger.success(`Connected to Redis!`);
        return callback(null, client)
    }
    catch(err) {
        callback(err)
    }

    
}