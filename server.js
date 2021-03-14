// import 3rd party modules
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');

// import custom modules
const configuration = require('./config');
const {logger} = require('./Config/winston');
const authenticationRoutes = require('./Routes/Routes');
require('./database');

dotenv.config();

const port = process.env.PORT;
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/auth', authenticationRoutes);

// start sever
app.listen(port, function() {
    logger.info(`App running on port ${port}`)
});