'use strict';
require('dotenv').config({silent: true, path: `${__dirname}/.env`});
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const mongostore = require('connect-mongo')(session);
const request = require('request');

const config = require(`${__dirname}/config`)[process.env.NODE_ENV];

var app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new mongostore({url: process.env.MONGO_URL}),
    resave: true,
    saveUninitialized: true,
    cookie: {
        cookieName: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        httpOnly: false,
        secure: false,
        ephemeral: true
    }
}));

//portal: 3100,
//authentication: 3200,
//accounts: 3400,
//transactions: 3600,
//bills: 3800,
//support: 4000,
//userbase: 4100
//require('./routes/auth')(app);
//require('./routes/user')(app, request, config.ports);
//require('./routes/bills')(app, request, config.ports);
//require('./routes/accounts')(app, request, config.ports);
//require('./routes/transactions')(app, request, config.ports);
//require('./routes/support')(app, request, config.ports);

require('./routes/auth')(app);
require('./routes/user')(app, request, '4100');
require('./routes/bills')(app, request, '3800');
require('./routes/accounts')(app, request, '3400');
require('./routes/transactions')(app, request, '3600');
require('./routes/support')(app, request, '4000');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3100;
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

console.log(`Running on ${process.env.BASE_PATH}:${port}, connecting to ${mongoURL}`)

mongoose.connect(mongoURL, function (ignore, connection) {
    connection.onOpen();
    server.listen(port, function () {
        console.log('Server running on port: %d', port);
    });
});
