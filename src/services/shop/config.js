module.exports.HTTP_PORT = 42000;
module.exports.HTTPS_PORT = 42443;
module.exports.FQDN = `shop.lgc.danceparty.lol`; // Service's FQDN

module.exports.SSL = false; // Enable SSL
// Path to certificates, ex: "/etc/letsencrypt/live/hello.com/privkey.pem"
module.exports.SSL_PK = `/etc/letsencrypt/live/${this.FQDN}/privkey.pem`;
module.exports.SSL_CERT = `/etc/letsencrypt/live/${this.FQDN}/cert.pem`;
module.exports.SSL_CA = `/etc/letsencrypt/live/${this.FQDN}/chain.pem`;

module.exports.CCS_URL = `http://${this.FQDN}/ccs/download`;
module.exports.CCS_URL = `http://${this.FQDN}/ccs-cdn/download`;

module.exports.ECS_URL = `http://${this.FQDN}/ecs/ECommerceSOAP`;
module.exports.IAS_URL = "https://ias.shop.wii.com/ias/services/IdentityAuthenticationSOAP" //`http://${this.FQDN}/ias/IdentityAuthenticationSOAP`;
module.exports.CAS_URL = `http://${this.FQDN}/cas/CatalogingSOAP`;
module.exports.NUS_URL = `http://${this.FQDN}/nus/NetUpdateSOAP`;