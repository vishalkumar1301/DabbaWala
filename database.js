const mongoose = require('mongoose')
const {configuration} = require('./config');
const {logger} = require('./Config/winston');

const server = configuration.mongoDbURL;
const dBName = configuration.dBName;

class Database {

    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${dBName}`, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    logger.info(`Database Connection with ${dBName} successfull`)
                })
                .catch((err) => {
                    logger.error(`Database connection error ${err}`);
                });
        
    }
}

module.exports = new Database();