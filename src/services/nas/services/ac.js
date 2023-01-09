
const axios = require("axios");
const uuid = require("uuid");

const nasToken = require("nas-token");
const b64 = require("../lib/b64");

module.exports = function (req, res, next) {

  const { action } = req.body;

  axios({
    method: "POST",
    url: `http://nas.wiimmfi.de/ac`,
    headers: {
      "User-Agent": "RVL SDK/1.0",
      "X-Forwarded-For": req.ip,
      HTTP_X_GAMECD: req.headers.HTTP_X_GAMECD || ""
    },
    data: b64.encode(req.body)
  })
    .then(ac => {

      let response = b64.decode(b64.toJSON(ac.data));

      switch (action) {

        case "svcloc":

          const { userid, lang, region, gamecd } = req.body;

          // Generate a random sessionId
          const sessionId = Math.floor(Math.random() * 100000000) + 999999999;

          let newToken = nasToken.encrypt({
            uid: userid.toString(),
            sid: sessionId.toString(),
            gid: gamecd.toString(),
            // loc: lang.toString(),
            // rgn: region.toString(),
            exp: Date.now() + (global.gs.TOKEN_EXPIRATION * 1000)
          });

          global.logger.info(`${userid} created token for ${gamecd} // sid: ${sessionId} // reg: ${region}`)

          response.token = newToken;
          response.servicetoken = newToken;
          break;
      }

      return res.send(b64.encode(response));
    })
    .catch(err => {
      global.logger.error(`Can't connect to AC: ${err}`);
      return res.sendStatus(500);
    });
}