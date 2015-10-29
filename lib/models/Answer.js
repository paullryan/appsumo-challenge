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
 * @module models/Answer
 * @description A model definition for Answers. Storage for answers.
 */

var Sequelize = require('sequelize');
var User = require('./User');

/**
 * @class Answer
 *
 * @property {Sequelize.UUID} uuid - The primary key for this model
 * @property {Sequelize.STRING} answer - The answer to the associated question.
 * @property {Sequelize.belongsTo} author - The author of this question.
 * @see {@link module:models/SurveyQuestion}
 * @license MIT
 */
var Answer = __db.define('answer', {
  uuid : {
    type : Sequelize.UUID,
    primaryKey : true,
    defaultValue: Sequelize.UUIDV4
  },
  answer: {
    type: Sequelize.TEXT('long')
  }
});

module.exports = Answer;
module.exports.Author = Answer.belongsTo(User, {as: 'author'});
