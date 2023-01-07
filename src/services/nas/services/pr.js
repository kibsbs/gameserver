
const axios = require("axios");
const b64 = require("../lib/b64");

module.exports = function (req, res, next) {

  const { action } = req.body

  axios({
    method: "POST",
    url: `http://nas.wiimmfi.de/pr`,
    headers: {
      "User-Agent": "RVL SDK/1.0",
      "X-Forwarded-For": global.config.SERVER_IP,
      HTTP_X_GAMECD: req.headers.HTTP_X_GAMECD || ""
    },
    data: b64.encode(req.body)
  })
    .then(pr => {
      return res.send(pr.data);
    })
    .catch(err => {
      global.logger.error(`Can't connect to PR: ${err}`);
      return res.sendStatus(500);
    });

};