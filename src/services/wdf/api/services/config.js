const fs = require("fs");
const express = require("express");
const router = express.Router({ 
    caseSensitive: true, 
    strict: true 
});

const utils = require("utils");

router.get("/", (req, res) => {
    res.send(utils.getConfig())
});

module.exports = router;