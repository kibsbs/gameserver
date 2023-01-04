const fs = require("fs");
const express = require("express");
const router = express.Router({ 
    caseSensitive: true, 
    strict: true 
});

router.get("/", (req, res) => {
    res.send("songs route");
});

module.exports = router;