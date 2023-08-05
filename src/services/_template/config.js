module.exports.HTTP_PORT = 80;
module.exports.HTTPS_PORT = 443;
module.exports.FQDN = `example.danceparty.lol`; // Service's FQDN

module.exports.SSL = false; // Enable SSL
// Path to certificates, ex: "/etc/letsencrypt/live/hello.com/privkey.pem"
module.exports.SSL_PK = `/etc/letsencrypt/live/${this.FQDN}/privkey.pem`;
module.exports.SSL_CERT = `/etc/letsencrypt/live/${this.FQDN}/cert.pem`;
module.exports.SSL_CA = `/etc/letsencrypt/live/${this.FQDN}/chain.pem`;