'use strict';

const mongoose = require('mongoose');
require('dotenv').config({silent: true, path: `${__dirname}/.env`});

var server = require('./app');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3400;
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

console.log(`Running on ${process.env.BASE_PATH}:${port}, connecting to ${mongoURL}`)

mongoose.connect(mongoURL, function (ignore, connection) {
    connection.onOpen();
    server.listen(port, function () {
        console.log('Server running on port: %d', port);
    });
});
