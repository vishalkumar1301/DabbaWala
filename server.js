// import 3rd party modules
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// import custom modules
const configuration = require('./config');
const {logger} = require('./Config/winston');
const authenticationRoutes = require('./Routes/Routes');
const addressRoute = require('./Routes/Address');
require('./database');

dotenv.config();

const port = process.env.PORT;
const app = express();
storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


app.post("/upload", multer({
        storage: storage
    }).single('photo'), function(req, res) {
        return res.status(200).json({message: req.file.filename});
});

app.use('/auth', authenticationRoutes);
app.use('/address', addressRoute);
    
    // start sever
    app.listen(port, function() {
        logger.info(`App running on port ${port}`)
});