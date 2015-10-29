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
 * @module models/User
 * @description A model definition for Users.
 */
var Sequelize = require('sequelize');
var Provider = require('./Provider');

/**
 * @class User
 *
 * @property {Sequelize.UUID} uuid - The primary key for this model
 * @property {Sequelize.STRING} firstName - The first name of this user.
 * @property {Sequelize.STRING} lastName - The last name of this user.
 * @property {Sequelize.STRING} userName - The username for this user (defaults to the email address).
 * @property {Sequelize.STRING} email - The email address of this user.
 * @property {Sequelize.STRING} password - The password for this user (hashed on may not exist if a provider does).
 * @property {Sequelize.STRING} role - The role of this user (default='subscriber').
 * @property {Sequelize.hasMany} providers - A set of providers for this user.
 * @see {@link module:models/Provider}
 * @license MIT
 */
var User = __db.define('user', {
  uuid : {
    type : Sequelize.UUID,
    primaryKey : true,
    defaultValue: Sequelize.UUIDV4
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name'
  },
  userName: {
    type: Sequelize.STRING,
    field: 'user_name'
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING
  }
});

module.exports = User;
module.exports.Providers = User.hasMany(Provider, {as: 'providers'});
