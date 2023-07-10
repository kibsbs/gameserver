const fs = require("fs");
const express = require("express");
const router = express.Router();

const utils = require("utils");

const cheatDetection = require("cheat-detection");

/**
 * @api {post} /moderation/ban-player Ban player by user ID
 * @apiName BanPlayer
 * @apiGroup Moderation
 * @apiVersion 1.0.0
 *
 * @apiBody {String} userId          Mandatory User ID of user.
 * @apiBody {String} [profileId="empty"]       Optional Profile ID of user
 * @apiBody {String} [reason="No reason given."]      Optional Reason of ban
 * @apiBody {String} [author="No author / banned from API"]          Optional Ban author
 * 
 */
router.post("/ban-player", async (req, res, next) => {
    let uid = req.body.userId;
    let pid = req.body.profileId || "empty";
    let reason = req.body.reason || "No reason given.";
    let author = req.body.author || "No author / banned from API.";
    if (!uid) {
        return next({
            status: 400,
            message: `userId required!`
        })
    }

    const result = await cheatDetection.banUser({
        userId: uid,
        profileId: pid,
        reason: reason,
        author: author
    });
    return res.json(result)
});

module.exports = router;