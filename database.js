const mongoose = require('mongoose')
const gridFSStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const {configuration} = require('./config');
const {logger} = require('./Config/winston');

const server = configuration.mongoDbURL;
const dBName = configuration.dBName;

class Database {

    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`${server}`, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    logger.info(`Database Connection with ${dBName} successfull | database.js`)
                })
                .catch((err) => {
                    logger.error(`Database connection error ${err} | database.js`);
                });
    }
}

module.exports = new Database();
module.exports = {
    storage: new gridFSStorage({  
        url: server,  
        file: (req, file) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) return err;
                const filename = buf.toString('hex') + path.extname(file.originalname);
                return {      
                        bucketName: 'Images',       
                        filename: filename
                }  
            })
       }
    })
}