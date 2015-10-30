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
 * @module middleware/passport-google
 *
 * @description This is an express middleware for connecting to google plus utilizing [Passport](http://passportjs.org/).
 *
 * _Note: This requires a valid client setup from the google developer console for OAuth2 Credentials and the Google+ API enabled_
 */

var path = require('path');
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require(path.join(__baseDir, 'lib/models/User'));
require('./passport-serializer')(passport);

var web = __config.auth.google.web;
var scope = __config.auth.google.scope;

/*
 * Stores the google profile as a new user if one doesn't exists as a 'subscriber'
 */
passport.use(new GoogleStrategy({
    clientID: web.client_id,
    clientSecret: web.client_secret,
    callbackURL: web.redirect_uri,
    approvalPrompt: "force"
  },
  function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value
    var firstName = profile.name.givenName;
    var lastName = profile.name.familyName;
    var link = profile._json.url;
    var providerId = profile.id;
    User.findCreateFind({
      where: {userName: email},
      defaults: {
        firstName: firstName,
        lastName: lastName,
        userName: email,
        email: email,
        role: 'subscriber',
        providers: [{
          type: 'google',
          providerId: providerId,
          link: link,
          accessToken: accessToken,
          refreshToken: refreshToken
        }]
      },
      include: [User.Providers]
    }).spread(function(user, created){
      done(null, user.get({plain: true}));
    }).catch(function(e){
      done(e);
    });
  }
));

/**
 * The auth exppress call for this middleware.
 * @function auth
 * @param req - The request
 * @param res - The response
 * @param next - A next callback to pass this on to
 */
module.exports.auth = function(req, res, next){
  passport.authenticate('google', { scope: scope })(req, res, next);
};

/**
 * The exppress callback for this middleware used as the OAuth2 Return.
 * @function callback
 * @param req - The request
 * @param res - The response
 * @param next - A next callback to pass this on to
 */
module.exports.callback = function(req, res, next){
  passport.authenticate('google', { failureRedirect: '/login' }, function(err, response){
    var returnTo;
    if(req.session && req.session.returnTo){
      var returnTo = req.session.returnTo;
      delete req.session.returnTo;
    }
    req.session.user = response;
    res.redirect(returnTo || '/');
  })(req, res, next);
};
