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
 * @module middleware/passport-local
 *
 * @description This is an express middleware for authenticating locally using [Passport](http://passportjs.org/).
 */

var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');
require('./passport-serializer')(passport);

var User = require(path.join(__baseDir, 'lib/models/User'));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      where: {
        userName: username
      }
    }).then(function(user) {
      user = user.get({plain: true});
      if (!user) {
        return done(null, false);
      }
      if (!passwordHash.verify(password, user.password)) {
        return done(null, false);
      }
      return done(null, user);
    }).catch(function(error){
      done(error);
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
exports.auth = function(req, res, next) {
  passport.authenticate('local', {}, function(err, response){
    var returnTo;
    if(req.session && req.session.returnTo){
      var returnTo = req.session.returnTo;
      delete req.session.returnTo;
    }
    if(err || !response){
      return res.redirect('/login');
    }
    if(!response){
    }
    req.session.user = response;
    res.redirect(returnTo || '/');
  })(req, res, next);
};
