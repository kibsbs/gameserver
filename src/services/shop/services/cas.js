const fs = require("fs");
const express = require("express");
const router = express.Router();

router.post("/CatalogingSOAP", require("./cas/CatalogingSOAP.js"));

module.exports = router;