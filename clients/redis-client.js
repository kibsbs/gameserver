
const redis = require("redis");

module.exports = function(config, callback) {

    if (!config.redis) throw new Error('Redis config is not defined.');

    logger.info(`Trying to connect to Redis...`)

    const client = redis.createClient(config.redis.port, config.redis.host, {'detect_buffers': true});

	client.select(config.redis.db, function(err) {
		if (err) return callback(err);

		global.logger.success(`Connected to Redis DB ${config.redis.db}`);
        return callback(null, client)
	});

}