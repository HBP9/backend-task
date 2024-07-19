const logger = require("./logger");

const loggingMiddleware = (req, res, next) => {
  if (req.method === "GET") {
    logger.info(
      `${req.method} on url ${req.url} with query ${JSON.stringify(req.query)}`
    );
  } else {
    logger.info(
      `${req.method} on url ${req.url} with body ${JSON.stringify(req.body)}`
    );
  }

  next();
};

module.exports = loggingMiddleware;
