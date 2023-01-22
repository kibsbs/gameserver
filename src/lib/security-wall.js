const async = require("async");
const ipRangeCheck = require("ip-range-check");

/**
 * Security Wall is a middleware that protects Gameserver from any hijacking etc.
 * - Ubisoft IPs
 * - Russian / Belarussian IPs (for competitors)
 * - VPN IPs 
 */

module.exports = (req, res, next) => {

    const blockedIps = require("../config/ip-blocklist.json");
    
    const ip = req.ip;
    const blocklist = blockedIps.map(a => a.ips).flat(2);
    const blockedCountries = global.gs.BLOCKED_COUNTRIES;

    async.waterfall([

        // Block any IP on our blocklist, for Ubisoft IPs.
        (cb) => {
            const isBlocked = ipRangeCheck(ip, blocklist);

            if (isBlocked) {
                global.logger.warn({
                    msg: `Blocked IP ${ip} tried to access ${req.originalUrl}!`,
                    headers: req.headers,
                    body: req.body
                });
                return res.status(403).send();
            };

            return cb();
        },

        // Block any forbidden country from access
        (cb) => {
            return cb();
            global.maxmind.country('176.88.93.39').then(response => {

                const iso = response.country.isoCode;
                if (blockedCountries.includes(iso)) {
                    global.logger.warn({
                        msg: `Blocked country ${iso} tried to access ${req.originalUrl}!`,
                        headers: req.headers,
                        body: req.body
                    });
                    return res.status(403).send();
                }
                else return cb();

            }).catch(err => {
                throw new Error(err);
            });
        },

        () => {
            return next();
        }

    ]);
};