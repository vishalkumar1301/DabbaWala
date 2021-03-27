// import 3rd party modules
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const multer = require('multer');

// import custom modules
const configuration = require('./config');
const {logger} = require('./Config/winston');
const authenticationRoutes = require('./Routes/Routes');
const addressRoute = require('./Routes/Address');
const { storage } = require('./database');

dotenv.config();

const port = process.env.PORT;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

var upload = multer({    
    storage: storage  
}).array('photos', 4);

app.post("/upload", upload, function(req, res) {
    return res.status(200).json({ message: 'files uploaded'});
});

app.use('/auth', authenticationRoutes);
app.use('/address', addressRoute);
    
    // start sever
    app.listen(port, function() {
        logger.info(`App running on port ${port}`)
});