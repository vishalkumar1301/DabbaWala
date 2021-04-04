const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const mealRoute = express.Router();
const { Constants } = require('../constants')
const { JSONResponse } = require('../Constants/Response');

var storage = multer.diskStorage({
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, buf) => {
            if(err) return err;
            const filename = buf.toString('hex') + path.extname(file.originalname);
            return cb(null, filename);
        })
   }
})
   
var upload = multer({ storage: storage })

mealRoute.post('/breakfast', upload.array('photos', 4), function (req, res) {
    res.json(new JSONResponse(null, Constants.SuccessMessages.BreakfastAdded).getJson());
});

module.exports = mealRoute;