const fs = require('fs');
const {Constants} = require('./constants');

const configPath = Constants.configPath;

var configuration = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

module.exports = {
    configuration
};