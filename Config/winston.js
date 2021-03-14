const path = require('path');

const winston = require('winston');

const logConfiguration = {
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname, '../logs', 'info.log')
        }),
        new winston.transports.File({
            level: 'error',
            filename: path.join(__dirname, '../logs', 'error.log')
        })
    ]
}

const logger  = winston.createLogger(logConfiguration);

module.exports = {
    logger
}