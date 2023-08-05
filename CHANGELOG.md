# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.6] - 2023-08-05

### Added
- Structure for the new Shop service
- Template folder for services
- Library to connect to MGMT, to fetch shop songs
### Updated
- Configuration

## [1.7.6] - 2023-07-11

### Added
## [WDF API] 
- Added Dancercard router, with a total dancercard count route
- Total song count route to Songs router

## [1.7.5] - 2023-07-10

### Added
- Swagger documentation for WDF API, available at the `/api/swagger` route.
- With `gameserver/src/services/wdf/api/generate-docs-swagger.sh`, the script can be used to generate swagger documentation for the API.

### Fixed
- A misconfiguration that led API routes to be accessed without API token.

## [1.7.4] - 2023-07-10

### Added
- Documentation for WDF API, available at the `/api` route.
- With `gameserver/src/services/wdf/api/generate-docs.sh`, the script can be used to generate documentation for the API.

### Updated
- Gameserver global variables

## [1.7.3] - 2023-06-21

### Updated
- Request validation schemas
- Name regex

### Fixed
- Issue with request validation
- "connectToWDF" now turns everyones name uppercase, which means names of users who edit their save files to have lowercase will appear uppercase to any other player.
- Session library's randomSession function's first parameter, count now has Number(), which threw error for the first fix mentioned above.

## [1.7.2] - 2023-06-21

### Updated
- Updated games config and WDF room names

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