const express = require('express');
const multer = require('multer');

const { storage } = require('../database');

const mealRoute = express.Router();

var upload = multer({    
    storage: storage  
}).array('photos', 4);

mealRoute.post('/breakfast', upload, function (req, res) {
    res.send(req.body);
});

module.exports = mealRoute;