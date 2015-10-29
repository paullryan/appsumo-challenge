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
 * @module auth
 *
 * @description Utility for ensuring the user is authenticated and authorized.
 */


/**
 * @description User authorization roles.
 *
 * Roles are order dependent, lowest (e.g. zeoreth element) is least priveleged with more priveleges granted
 * the higher you go in the roles.
 * @enum {string}
 * @readonly
 * @property subscriber - The base role for a new user
 * @property admin - Admin level users get this role
 * @property superuser - Highest level user, should be able to do anything they want
 */
var ROLES = [
  'subscriber',
  'admin',
  'superuser'
]

function isAuthenticated(req){
  if(req.session.user){
    return true;
  }
  return false;
}

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    req.session.returnTo = req.path;
    res.redirect('/login');
  }
}

function apiEnsureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({error: {
      message: 'Secure area requires authentication'
    }});

  }
}

function hasPermission(user, role){
  if(user && ROLES.indexOf(user.role) >= ROLES.indexOf(role)) {
    return true
  }
  return false;
}

function ensureAdmin(req, res, next) {
  var user = req.session.user;

  if(hasPermission(user, 'admin')) {
    return next();
  }
  res.redirect('/403')
}

function ensureApiAdmin(req, res, next) {
  var user = req.session.user;

  if(hasPermission(user, 'admin')) {
    return next();
  }
  res.status(403).json({error: {
    message: "Requires admin role or higher"
  }});
}

module.exports.isAuthenticated = isAuthenticated;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.apiEnsureAuthenticated = apiEnsureAuthenticated;
module.exports.ensureAdmin = ensureAdmin;
module.exports.ensureApiAdmin = ensureApiAdmin;
module.exports.hasPermission = hasPermission;
