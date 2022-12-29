const morgan = require("morgan");
const logger = require("logger");
const utils = require("utils");

const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = () => {
  return !utils.isDev();
};

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);

module.exports = morganMiddleware;