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
 * @module models/SurveyQuestion
 * @description A model definition for survey questions.
 */

var Sequelize = require('sequelize');
var User = require('./User');
var Answer = require('./Answer');

/**
 * The field types for questions.
 * @readonly
 * @enum {string}
 * @property text - A text type field
 * @property checkbox - A checkbox type field, if there are multiple options then this a multi-check
 * @property radios - A radio buttons type field
 * @property textarea - A textarea type field
 * @property select - A single select type field
 */
var TYPES = [
  'text',
  'checkbox',
  'radios',
  'textarea',
  'select'
];

/**
 * @class SurveyQuestion
 *
 * @property {Sequelize.UUID} uuid - The primary key for this model
 * @property {Sequelize.STRING} question - The question to ask survey respondants.
 * @property {Sequelize.ENUM} type - The field type of question {TYPES}
 * @property {Sequelize.STRING} options - The options for type that takes options as a comma seperated string
 * @property {Sequelize.BOOLEAN} archived - A flag as to whether or not this survey question is archived.
 *     When a question is archived it should not be displayed to survey respondants.
 *
 * @property {Sequelize.belongsTo} author - The author of this question.
 * @property {Sequelize.hasMany} answers -The answers to this question.
 * @license MIT
 */
var SurveyQuestion = __db.define('survey_question', {
  uuid : {
    type : Sequelize.UUID,
    primaryKey : true,
    defaultValue: Sequelize.UUIDV4
  },
  question: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.ENUM,
    values: TYPES,
    defaultValue: 'text'
  },
  options: {
    type: Sequelize.STRING
  },
  archived: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = SurveyQuestion;
module.exports.Author = SurveyQuestion.belongsTo(User, {as: 'author'});
module.exports.Answers = SurveyQuestion.hasMany(Answer, {as: 'answers'});
module.exports.TYPES = TYPES;
