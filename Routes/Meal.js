const express = require('express');
const multer = require('multer');

const { storage } = require('../database');

const mealRoute = express.Router();

var fileNameMiddleware = multer.diskStorage({
    filename: function (req, file, cb) {
        crypto.randomBytes(16, (err, buf) => {
            if(err) return err;
            const filename = buf.toString('hex') + path.extname(file.originalname);
            cb(null, filename);
        })
    }
});

var fileNameMiddleware = multer({ storage: fileNameMiddleware });
var upload = multer({    
    storage: storage  
}).array('photos', 4);

mealRoute.post('/breakfast', fileNameMiddleware.array('photos', 4), upload, function (req, res) {
    console.log(req.files);
    res.send(req.body);
});

module.exports = mealRoute;