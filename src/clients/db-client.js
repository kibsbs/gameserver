
const mongoose = require("mongoose");

module.exports = async function(config, callback) {

    if (!config.database) throw new Error('DB config is not defined.');
    const url = `${config.database.path}`

    global.logger.info(`Trying to connect to MongoDB...`)

    mongoose.connect(url, function(err) {
        if (err) {
            global.logger.error(`Error occured while trying to connect to MongoDB: ${err}`)
            return callback(err)
        }

        global.logger.success(`Connected to MongoDB successfully!`)
        return callback();
    });

}