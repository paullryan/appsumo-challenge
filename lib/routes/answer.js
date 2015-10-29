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
 * @module routes/answer
 *
 * @description API routes for manipulating {@link module:models/Answer}
 */

var path = require('path');
var express = require('express');
var SurveyQuestion = require(path.join(__baseDir, 'lib/models/SurveyQuestion'));
var Answer = require(path.join(__baseDir, 'lib/models/Answer'));

var auth = require(path.join(__baseDir, 'lib/auth'));
var handleReturn = require(path.join(__baseDir, 'lib/middleware/return.js'));

var router = express.Router();

router.all('/secure/*', auth.apiEnsureAuthenticated);

/**
 * @function /
 * @description
 * **route**: /
 *
 * **method**: POST
 * @return The posted answer or a redirect to returnTo
 * @example
 {
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   answer: 'foo,bar',
   ...
 }
 */
router.post('/', function(req, res, next){
  var promises = [];
  var body = req.body
  var ids = [];
  var userId;

  if(req.session.user){
    userId = req.session.user.uuid;
  }

  for(var key in req.body){
    ids.push(key.substring('question-'.length));
  }
  SurveyQuestion.findAll({
    where: {
      $or: {uuid: ids}
    }
  }).then(function(questions){
    var promises = [];

    for(var i = 0; i < questions.length; i++){
      var question = questions[i];
      var answerValue = body['question-' + question.uuid];
      if(typeof answerValue === 'array' || typeof answerValue === 'object'){
        answerValue = answerValue.join(',');
      }
      promises.push(Answer.create({
        answer: answerValue,
        authorUuid: userId,
        surveyQuestionUuid: question.uuid
      }, {
        include: [Answer.Author]
      }));
    }

    Promise.all(promises).then(function(answers){
      var rawAnswers = answers.map(function(answer){
        return answer.get({plain: true});
      });
      req.returnData = rawAnswers;
      next();
    }).catch(function(error){
      throw error;
    });
  });
}, handleReturn);

module.exports = router;
