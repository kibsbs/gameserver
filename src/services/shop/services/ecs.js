const fs = require("fs");
const express = require("express");
const router = express.Router();

router.post("/ECommerceSOAP", require("./ecs/ECommerceSOAP.js"));

module.exports = router;