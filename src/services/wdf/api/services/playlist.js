const fs = require("fs");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("playlist route");
});

module.exports = router;