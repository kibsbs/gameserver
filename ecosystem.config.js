const baseEnvironments = {
    env_prod: {
        NODE_ENV: "prod",
        FQDN: "gs-rhode.lgc.danceparty.lol"
    },
    env_dev: {
        NODE_ENV: "dev",
        FQDN: "gs-rhode-dev.lgc.danceparty.lol"
    },
    env_qc: {
        NODE_ENV: "qc",
        FQDN: "gs-rhode-qc.lgc.danceparty.lol"
    }
};

const serviceEnvironments = {
    jmcs: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 3000
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 3001
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 3002
        }
    },
    wdf: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 6000
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 6001
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 6002
        }
    },
    shop: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 42000
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 42001
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 42002
        }
    },
    nas: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 12000
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 12001
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 12002
        }
    },
    tracking: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 30000
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 30001
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 30002
        }
    }
};

module.exports = {
    apps: [{
        name: "jmcs",
        appendEnvToName: true,
        script: "src/gameserver.js",
        args: "serve jmcs",
        ...serviceEnvironments.jmcs
    }, {
        name: "wdf",
        appendEnvToName: true,
        script: "src/gameserver.js",
        args: "serve wdf",
        ...serviceEnvironments.wdf
    }, {
        name: "shop",
        appendEnvToName: true,
        script: "src/gameserver.js",
        args: "serve shop",
        ...serviceEnvironments.shop
    }, {
        name: "nas",
        appendEnvToName: true,
        script: "src/gameserver.js",
        args: "serve nas",
        ...serviceEnvironments.nas
    }, {
        name: "tracking",
        appendEnvToName: true,
        script: "src/gameserver.js",
        args: "serve tracking",
        ...serviceEnvironments.tracking
    }]
};