// import 3rd party modules
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');

// import custom modules
const configuration = require('./config');
const {logger} = require('./Config/winston');
const { verifyLocalToken } = require('./Authentication/verifyLocalToken');
const authenticationRoutes = require('./Routes/Routes');
const addressRoute = require('./Routes/Address');
const mealRoute = require('./Routes/Meal');
require('./database');

dotenv.config();

const port = process.env.PORT;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/auth', authenticationRoutes);

app.use(verifyLocalToken);
app.use('/', mealRoute);
app.use('/address', addressRoute);

// start sever
app.listen(port, function() {
    logger.info(`App running on port ${port}`)
});