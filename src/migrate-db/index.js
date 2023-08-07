const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dbClient = require("../lib/clients/db-client");
const memcachedClient = require("../lib/clients/memcached-client");
const cache = require("../lib/cache");

const db = require("../lib/models/song");

/**
 * Calculates hash of folder with hash of all files in the folder
 * @param {String} folderPath Path to folder
 * @returns 
 */
function calculateFolderHash(folderPath) {
    const hash = crypto.createHash('sha256');
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = `${folderPath}/${file}`;
        if (!fs.statSync(filePath).isFile()) continue; // exclude non-files

        const fileData = fs.readFileSync(filePath);
        hash.update(fileData);
    };

    return hash.digest('hex');
};

module.exports = async () => {

    // Migrate needs memcached to keep the hash of the migration data in cache
    // so that each update it checks the hash and then updates if it changed.

    // If DB is not used by current service, connect to it for Migrate.
    if (!global.dbClient) {
        let dbURI;
        if (process.env.DB_URI) dbURI = process.env.DB_URI;
        else dbURI = global.gs.DATABASE.migrateDb[global.ENV];
        
        await dbClient(dbURI);
    };

    // If memcached is not used by current service, connect to it for Migrate.
    if (!global.memcached) {
        let memURI;
        if (process.env.MEMCACHED_URI) memURI = process.env.MEMCACHED_URI;
        else memURI = global.gs.MEMCACHED.migrateDb[global.ENV];

        memcachedClient(memURI);
        cache.m = global.memcached; // Since cache is initalized before memcached, update it's local variable
    };

    // We migrate by folders in migrate-db folder, if you want to add additional migration data, you can update the array below.
    const folders = ["songdb"];

    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        const folderPath = path.resolve(__dirname, folder);

        const currentHash = calculateFolderHash(folderPath);

        const key = `migrate-db:${folder}`; // e.g. migrate-db:songdb
        const cacheHash = await cache.getStr(key);

        // If cache hash does not match the folder's current hash, it means something must've changed
        // so update the hash and migrate the data if anything has changed.
        if (cacheHash !== currentHash) {

            global.logger.info(`Change was detected with migration data, please wait...`);

            // Some folders might need specific or different migration treatment

            if (folder == "songdb") {

                // Read JSON files in the folder
                const dbFiles = fs.readdirSync(folderPath);
                // Combine JSON files into one songDB
                const dbs = dbFiles.flatMap(f => JSON.parse(fs.readFileSync(`${folderPath}/${f}`, 'utf-8')));

                // Loop through all songs and upsert them to the db
                for (let i = 0; i < dbs.length; i++) {
                    const songDesc = dbs[i];
                    const mapName = songDesc.mapName;
                    const version = songDesc.version;

                    // For JDJapan, we include JP map name into the query because
                    // JDJ is a mod thats modded over 2014 songs and it could cause issues with the 2014 songdb mapnames.

                    // Maps are categoried by mapName and version, a map with an existing mapName & version equilevant won't be allowed into the db.
                    const query = version == 1000 ? {
                        mapName, version, mapNameJP: songDesc.mapNameJP
                    } : {
                        mapName, version
                    };

                    try {
                        // Upsert song to database
                        await db.findOneAndUpdate(
                            query, songDesc, { upsert: true }
                        );
                    }
                    catch (err) {
                        global.logger.error(`An error occured with migrate-db songdb: ${err}`);
                        process.exit(1);
                    };
                };
            };

            // If migration was successful, update the cache hash
            await cache.set(key, currentHash);
            global.logger.success("Successfully migrated DB.")
        };
    };
};