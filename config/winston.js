const winston = require('winston');
const appRoot = require('app-root-path');

const options = {
    File: {
        level: "info",
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        maxsize: 5000000,
        maxFile: 5
    },

    console: {
        level: "debug",
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.simple(),
            winston.format.colorize()
        ),
    },
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.File),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message) {
        logger.info(message)
    },
};

module.exports = logger;