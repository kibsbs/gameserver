const fs = require("fs");
const express = require("express");
const router = express.Router();

const utils = require("utils");

router.get("/", (req, res) => {
    res.send(utils.getConfig())
});

module.exports = router;