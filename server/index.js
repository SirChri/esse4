import express from 'express';
import login from './login';

import appelli from './student/appelli';
import prenota from './student/prenota';
import user from './user';

import admin from './admin/admin';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// this is needed by the client-side routing facility (i.e., page)
import history from 'express-history-api-fallback';
import config from './config';

mongoose.connect(config.db);

const app = express();

app.use(bodyParser.json());
// this middleware will act as logger
app.use(function(req, res, next) {
    console.log(`ℹ️ ${Date()} handling request ${req.method} to ${req.originalUrl}`);
    next();
});
// here you can put the specific REST mountpoints
app.use('/api/login', login);
app.use('/api/appelli', appelli);
app.use('/api/prenota', prenota);
app.use('/api/user', user);
app.use('/api/admin', admin);

// this will serve also the front-end from the dist directory
app.use('/', express.static('dist'));
app.use(history('index.html', { root: 'dist' }));
// a generic logger for wrong urls 
app.use('*', function(req, res, next) {
    let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); // Tells us which IP tried to reach a particular URL
    err.statusCode = 404;
    err.shouldRedirect = true; //New property on err so that our middleware will redirect
    next(err);
});

// a logger for errors
app.use(function(err, req, res, next) {
    if (err) {
        console.error(`❌ ${Date()} ${err.message}`);
    }
    next();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
