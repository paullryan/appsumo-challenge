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
 * @module middleware/passport-facebook
 *
 * @description This is an express middleware for connecting to facebook utilizing [Passport](http://passportjs.org/).
 *
 * **Not Yet Implemented**
 *
 * _Note: This requires a valid client setup from the facebook developer console for OAuth2 Credentials_
 */

var passport = require('passport')
var web = __config.auth.google.web;
var scope = __config.auth.google.scope;

/**
 * The auth exppress call for this middleware.
 * @function auth
 * @param req - The request
 * @param res - The response
 * @param next - A next callback to pass this on to
 */
exports.auth = function(req, res, next){
  res.status(501).end();
};

/**
 * The exppress callback for this middleware used as the OAuth2 Return.
 * @function callback
 * @param req - The request
 * @param res - The response
 * @param next - A next callback to pass this on to
 */
exports.callback = function(req, res, next){
  res.status(501).end();
};
