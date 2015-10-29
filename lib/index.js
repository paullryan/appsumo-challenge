/******************************************************************************
 * The MIT License (MIT)
 * Copyright © 2015 Paul Ryan

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ******************************************************************************
 * Author: Paul Ryan <paul@simplycomplex.co>
 ******************************************************************************/
'use strict';

/**
 * @module index
 *
 * @description Main application.
 *
 * Express based utilizing SequelizeJS and handlebars templates directly rendered.
 */

var express = require('express');
var path = require('path');
var colors = require('colour');
var logger = require('morgan');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var formidable = require('express-formidable');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var methodOverride = require('method-override');
var Sequelize = require('sequelize');
var expresshbs = require('express-handlebars');
require('dotenv').load();

global.__config = require('../config');
console.dir(__config);
global.__baseDir = path.normalize(path.join(__dirname, '..'));

var sequelize = new Sequelize(__config.db.name, __config.db.username, __config.db.password, {
  host: __config.db.host,
  port: __config.db.port,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true}).then(function(){
  sequelize.sync({
    force: false,
    logging: console.log
  });
});

global.__db = sequelize;

var auth = require('./auth');
var passportGoogle = require('./middleware/passport-google');
var passportFacebook = require('./middleware/passport-facebook');

var app = express();

var publicPath = path.normalize(path.join(__dirname, '..', 'public'));

var hbs = expresshbs.create({
  extname:'hbs',
  defaultLayout:'main.hbs',
  helpers: {
    is: function (value, test, options) {
      if (value === test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
});

// view engine setup
app.set('views', path.normalize(path.join(__dirname, '..', 'views')));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.locals.siteTitle = 'Appsumo Challenge App';

app.use(favicon(path.join(publicPath, 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(formidable.parse());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: new FileStore({ path: './.sessions' }),
  resave: true,
  secret: __config['cookie-secret']
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('X-HTTP-Method'))          // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override'))      // IBM
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.get('/auth/google', passportGoogle.auth);
app.get('/auth/google/callback', passportGoogle.callback);
app.get('/auth/facebook', passportFacebook.auth);
app.get('/auth/facebook/callback', passportFacebook.callback);

var apiV1Router = express.Router();
apiV1Router.use('/answer', require('./routes/answer'));
apiV1Router.use('/survey-question', require('./routes/surveyQuestion'));

app.use('/api/v1', apiV1Router);

app.use('/', require('./routes'));

app.use('/components', express['static'](path.normalize(path.join(__dirname, '..', 'bower_components'))));
app.use('/', express['static'](path.normalize(path.join(__dirname, '..', 'public'))));

app.get('/403', function(req, res){
  res.locals.pageTitle = "Unauthorized";
  res.render('403');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.locals.pageTitle = "404 - Not Found";
  res.render('404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(__config.port, __config.hostname, function(error){
  if(error){
    throw error;
  }
  console.log('Server Started on Port ' + __config.port.toString().green);
});

module.exports = app;
