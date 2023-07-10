const fs = require("fs");
const express = require("express");
const router = express.Router({ 
    caseSensitive: true, 
    strict: true 
});

const mids = require("http-middleware");

// Set req.isApi true to all requests and proceed
router.use((req, res, next) => {
    req.isApi = true;
    return next();
});

// Make "docs" folder public to make documentation public
router.use('/', express.static(__dirname + "/docs"));

router.use("/config", require("./services/config"));
router.use("/leaderboard", require("./services/leaderboard"));
router.use("/moderation", require("./services/moderation"));
router.use("/playlist", require("./services/playlist"));
router.use("/sessions", require("./services/sessions"));
router.use("/songs", require("./services/songs"));

// Apply API authorization middleware
router.use(mids.apiAuth);

module.exports = router;