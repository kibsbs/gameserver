const fs = require("fs");
const express = require("express");
const router = express.Router({ 
    caseSensitive: true, 
    strict: true 
});

router.get("/test", (req, res) => {
    res.send("test")
});

router.use("/config", require("./services/config"));
router.use("/moderation", require("./services/moderation"));
router.use("/playlist", require("./services/playlist"));
router.use("/songs", require("./services/songs"));

module.exports = router;