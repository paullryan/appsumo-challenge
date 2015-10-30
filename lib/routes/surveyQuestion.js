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
 * @module routes/surveyQuestion
 *
 * @description API routes for manipulating {@link module:models/SurveyQuestion}
 */

var path = require('path');
var express = require('express');
var SurveyQuestion = require(path.join(__baseDir, 'lib/models/SurveyQuestion'));

var auth = require(path.join(__baseDir, 'lib/auth'));
var handleReturn = require(path.join(__baseDir, 'lib/middleware/return.js'));

var router = express.Router();

router.all('/secure/*', auth.apiEnsureAuthenticated, auth.ensureApiAdmin);


/**
 * @function /secure
 * @description
 * **route**: /secure/:uuid
 *
 * **method**: GET
 * @param UUID uuid - The uuid of the question to get
 * @return The question or a redirect to returnTo
 * @example
 {
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas'
   ...
 }
 */
router.get('/secure/:uuid', function(req, res, next){
  SurveyQuestion.findOne({
    where: {uuid: req.params.uuid}
  }, {
    include: [SurveyQuestion.Author, SurveyQuestion.Answers]
  }).then(function(question){
    if(!question || question === null){
      return res.status(404).end();
    }
    req.returnData = question.get({plain: true});
    next();
  });
}, handleReturn);


/**
 * @function /secure/
 * @description
 * **route**: /secure/
 *
 * **method**: POST
 * @return The posted question or a redirect to returnTo
 * @example
 {
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas'
   ...
 }
 */
router.post('/secure/', function(req, res, next){
  SurveyQuestion.create({
    question: req.body.question,
    type: req.body.type || 'text',
    options: req.body.options.toString(),
    authorUuid: req.session.user.uuid
  }, {
    include: [SurveyQuestion.Author]
  }).then(function(question){
    if(!question || question === null){
      return res.status(404).end();
    }
    req.returnData = question.get({plain: true});
    next();
  });
}, handleReturn);

/**
 * @function /secure/archive
 * @description
 * **route**: /secure/archive/:uuid
 *
 * **method**: GET
 * @param UUID uuid - The uuid of the question to archive
 * @return The posted question or a redirect to returnTo
 * @example
 {
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas',
   archived: true
   ...
 }
 */
router.get('/secure/archive/:uuid', function(req, res, next){
  SurveyQuestion.findOne({where: {uuid: req.params.uuid}}).then(function(question){
    if(!question || question === null){
      return res.status(404).end();
    }
    question.set('archived', true);
    question.save().then(function(question){
      req.returnData = question.get({plain: true});
      next();
    })
  });
}, handleReturn);

/**
 * @function /secure/unarchive
 * @description
 * **route**: /secure/unarchive/:uuid
 *
 * **method**: GET
 * @param UUID uuid - The uuid of the question to unarchive
 * @return The posted question or a redirect to returnTo
 * @example
 {
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas',
   archived: false
   ...
 }
 */
router.get('/secure/unarchive/:uuid', function(req, res, next){
  SurveyQuestion.findOne({where: {uuid: req.params.uuid}}).then(function(question){
    if(!question || question === null){
      return res.status(404).end();
    }
    question.set('archived', false);
    question.save().then(function(question){
      req.returnData = question.get({plain: true});
      next();
    })
  });
}, handleReturn);

/**
 * @function /secure/
 * @description
 * **route**: /secure/:uuid
 *
 * **method**: DELETE
 * @param UUID uuid - The uuid of the question to delete
 * @return an empty success or a redirect to returnTo
 */
router.delete('/secure/:uuid', function(req, res, next){
  SurveyQuestion.destroy({where: {uuid: req.params.uuid}}).then(function(){
    next();
  });
}, handleReturn);

module.exports = router;
