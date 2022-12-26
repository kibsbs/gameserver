// Used for signing/verifying NAS tokens.
module.exports.NAS_TOKEN = {
    nasServer: process.env.NAS_SERVER,
    vector: process.env.NAS_VECTOR,
    securityKey: process.env.NAS_KEY
}

// Keys which are allowed to access the API.
module.exports.API_KEYS = [
    "9c4e6cdf-ea67-48cc-9c84-b70075d999f8"
]

// Used in development
module.exports.TEST_TOKENS = [
    "test"
]