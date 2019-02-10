const config = require('config');

const applicationConfig = {
    port: config.get('application_port'),
    mongoUrl: config.get("mongoConnection.mongoUrl"),
    mongoCollection: config.get("mongoConnection.mongoCollections")
};

module.exports = Object.assign({},applicationConfig);
