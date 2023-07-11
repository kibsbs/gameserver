const fs = require("fs");
const express = require("express");
const router = express.Router();

const dancercard = require("dancercard");

/**
 * @api {get} /dancercard/count Get amount of registered dancercards
 * @apiName GetDancercardCount
 * @apiGroup Dancercard
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {Number} count Count
 */
router.get("/count", async (req, res, next) => {
    return res.json({
        count: await dancercard.count()
    });
});

module.exports = router;