# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.1] - 2023-06-20

### Added

- Updated `gameserver.js` port listener, now services can listen to HTTPS port with valid certificates.
- Added a new variable `FQDN` to service specific config to identify the service's domain. Future updates might update Security wall to verify the FQDN.
- Added new variables for service specific config: `SSL_PK`, `SSL_CERT`, `SSL_CA` which needs to be full path to the certificates of the service.
- Added a new variable `IS_ON_CLOUDFLARE` to service specific config (or Gameserver config to affect all services), to determine whether Gameserver is proxied through Cloudflare or not. It is used by security wall, used to get client's country from Cloudflare's `cf-country` header to check if the client's country is banned from accessing the services. When server is used without Cloudflare, security wall threw and error on every request indicating that there is no header for the country checked. This new config skips this check.

### Updated

- NAS's `ac` router error handler now gives more information on the error from Wiimmfi and gives 401 for Dolphin NANDs.

### Removed

- Removed Russia and Belarus from blocked countries.