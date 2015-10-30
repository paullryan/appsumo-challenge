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
 * @module routes/user
 *
 * @description API routes for manipulating {@link module:models/User}
 */

var path = require('path');
var express = require('express');
var passwordHash = require('password-hash');

var User = require(path.join(__baseDir, 'lib/models/User'));

var auth = require(path.join(__baseDir, 'lib/auth'));
var handleReturn = require(path.join(__baseDir, 'lib/middleware/return.js'));

var router = express.Router();

router.all('/secure/*', auth.apiEnsureAuthenticated, auth.ensureApiAdmin);

/**
 * @function /
 * @description
 * **route**: /
 *
 * **method**: POST
 * @return The posted user or a redirect to returnTo
 * @example
 {
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   firstName: 'bob',
   lastName: 'anderson',
   userName: 'bob@anderson.foo',
   email: 'bob@anderson.foo'
   ...
 }
 */
router.post('/', function(req, res, next){
  var promises = [];
  var body = req.body
  var ids = [];
  User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    userName: body.email,
    email: body.email,
    role: 'subscriber',
    password: passwordHash.generate(body.password)
  }).then(function(user){
    if(!user || user === null){
      return res.status(404).end();
    }
    var parsedUser = user.get({plain: true});
    req.session.user = user.get({plain: true});
    delete parsedUser.password;
    req.returnData = parsedUser;
    next();
  });
}, handleReturn);

module.exports = router;
