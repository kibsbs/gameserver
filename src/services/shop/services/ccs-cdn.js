const fs = require("fs");
const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/download/:titleId/:file", (req, res, next) => {
    const { titleId, file } = req.params;
    const titles = path.resolve(__dirname, "../titles");
    const filePath = path.resolve(titles, titleId, file);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=600');
    res.setHeader('Connection', 'keep-alive');

    if (fs.existsSync(filePath)) return res.sendFile(filePath);
    else return res.sendStatus(404);
});

module.exports = router;