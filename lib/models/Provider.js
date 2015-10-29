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
 * @module models/Provider
 * @description A model definition for OAuth2 Providers.
 */

var Sequelize = require('sequelize');

/**
 * @class Provider
 *
 * @property {Sequelize.UUID} uuid - The primary key for this model
 * @property {Sequelize.STRING} type - The provider type (e.g. google, facebook, etc.)
 * @property {Sequelize.STRING} providerId - The id from the provider (could be a string or url)
 * @property {Sequelize.STRING} link - Link to the provider profile for this user.
 * @property {Sequelize.STRING} accessToken - The access token for OAuth2
 * @property {Sequelize.STRING} refreshToken - The refresh token for OAuth2
 * @license MIT
 */
var Provider = __db.define('provider', {
  uuid : {
    type : Sequelize.UUID,
    primaryKey : true,
    defaultValue: Sequelize.UUIDV4
  },
  type: {
    type: Sequelize.STRING
  },
  providerId: {
    type: Sequelize.STRING,
    field: 'provider_id'
  },
  link: {
    type: Sequelize.STRING
  },
  accessToken: {
    type: Sequelize.STRING,
    field: 'access_token'
  },
  refreshToken: {
    type: Sequelize.STRING,
    field: 'refresh_token'
  }
});

module.exports = Provider;
