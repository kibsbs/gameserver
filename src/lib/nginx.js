const fs = require("fs");
const path = require("path");

/**
 * Everytime the server restarts/launches, this function gets called to write a NGINX conf everytime
 * Because we have multiple environments in one server in different ports 
 * and aint nobody got time to create conf for 5+ environments for each 5 service
 */
module.exports = () => {

    // This lib is enabled by NGINX_LIB_ENABLED env value
    if (!process.env.NGINX_LIB_ENABLED || (process.env.NGINX_LIB_ENABLED && process.env.NGINX_LIB_ENABLED == "false")) {
        return;
    }

    let sitesPath

    if (process.env.NGINX_SITES_PATH) {
        if (!fs.existsSync(process.env.NGINX_SITES_PATH)) {
            global.logger.error(`ENV variable ${NGINX_SITES_PATH} path doesnt exist!`);
            process.exit(1);
        }
        else sitesPath = process.env.NGINX_SITES_PATH;
    }
    else {
        // Internally we keep our nginx confs in repository
        if (fs.existsSync("/root/dp/nginx-sites/conf/gameserver")) sitesPath = "/root/dp/nginx-sites/conf/gameserver";
        // If it doesnt exist, define nginx default sites-enabled
        else {
            if (!fs.existsSync("/etc/nginx/sites-enabled")) {
                global.logger.error(`Couldn't find NGINX path, if you're on another OS or you got NGINX somewhere else, provide path to your sites-available or sites-enabled in environmental value NGINX_SITES_PATH`);
                process.exit(1);
            }
            else sitesPath = "/etc/nginx/sites-enabled";
        };
    };

    let serviceId = global.service.id;
    let port = global.HTTP_PORT;
    let fqdn = global.FQDN;
    let isCloudflare = global.IS_ON_CLOUDFLARE;

    let conf = `
    server {
        listen 80;
        server_name ${fqdn};
        
        location / {
            proxy_pass http://localhost:${port};
            proxy_set_header Host $host;
            proxy_set_header X-DP-Service ${serviceId};
            ${isCloudflare ? "real_ip_header CF-Connecting-IP;" : ""}
        }
    }`;

    fs.writeFileSync(
        // save to sitesPath/serviceId-ENV (without extension)
        // which means you need to include the sites folder like "include sitesPath/*" in your nginx confs
        path.resolve(sitesPath, `${serviceId}-${global.ENV.toLowerCase()}`),
        conf
    );
    global.logger.success("Updated NGINX configuration!");
    // TODO: maybe run service nginx restart here?
};