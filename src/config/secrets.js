// Used for signing/verifying NAS tokens.
module.exports.NAS_TOKEN = {
    server: process.env.NAS_SERVER,
    iv: process.env.NAS_IV,
    key: process.env.NAS_KEY,
    algorithm: "aes-256-cbc"
};

// Keys which are allowed to access the API.
module.exports.API_KEYS = JSON.parse(process.env.API_KEYS || "[]");

// Used in development.
module.exports.TEST_TOKENS = [
    "test"
];