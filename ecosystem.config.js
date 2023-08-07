const baseEnvironments = {
    env_prod: {
        NODE_ENV: "prod"
    },
    env_dev: {
        NODE_ENV: "dev"
    },
    env_qc: {
        NODE_ENV: "qc",
    }
};

const serviceEnvironments = {
    jmcs: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 3000,
            FQDN: "gs-rhode.lgc.danceparty.lol"
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 3001,
            FQDN: "gs-rhode-dev.lgc.danceparty.lol"
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 3002,
            FQDN: "gs-rhode-qc.lgc.danceparty.lol"
        }
    },
    wdf: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 6000,
            FQDN: "gs-wdf.lgc.danceparty.lol"
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 6001,
            FQDN: "gs-wdf-dev.lgc.danceparty.lol"
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 6002,
            FQDN: "gs-wdf-qc.lgc.danceparty.lol"
        }
    },
    shop: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 42000,
            FQDN: "shop.lgc.danceparty.lol"
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 42001,
            FQDN: "shop-dev.lgc.danceparty.lol"
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 42002,
            FQDN: "shop-qc.lgc.danceparty.lol"
        }
    },
    nas: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 12000,
            FQDN: "nas.lgc.danceparty.lol"
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 12001,
            FQDN: "nas-dev.lgc.danceparty.lol"
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 12002,
            FQDN: "nas-qc.lgc.danceparty.lol"
        }
    },
    tracking: {
        env_prod: {
            ...baseEnvironments.env_prod,
            HTTP_PORT: 30000,
            FQDN: "tracking.lgc.danceparty.lol"
        },
        env_dev: {
            ...baseEnvironments.env_dev,
            HTTP_PORT: 30001,
            FQDN: "tracking-dev.lgc.danceparty.lol"
        },
        env_qc: {
            ...baseEnvironments.env_qc,
            HTTP_PORT: 30002,
            FQDN: "tracking-qc.lgc.danceparty.lol"
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