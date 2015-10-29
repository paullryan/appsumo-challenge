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
 * @module routes/index
 *
 * @description The default page router, used for render routes
 */

var path = require('path');
var express = require('express');
var SurveyQuestion = require(path.join(__baseDir, 'lib/models/SurveyQuestion'));
var Answer = require(path.join(__baseDir, 'lib/models/Answer'));

var auth = require(path.join(__baseDir, 'lib/auth'));

var router = express.Router();

router.use(function(req, res, next){
    res.locals.isAuthenticated = auth.isAuthenticated(req);
    res.locals.isAdmin = auth.hasPermission(req.session.user, 'admin');
    next();
});

/**
 * @function /
 * @description
 * **route**: /
 *
 * **method**: GET
 * @return renders index
 */
router.get('/', function(req, res){
  res.locals.pageTitle = __config.home.title;
  req.session.returnTo = '/results';
  SurveyQuestion.findAll({
    where: {archived: false},
    include: [SurveyQuestion.Author, SurveyQuestion.Answers]
  }).then(function(questions){
    res.locals.surveyQuestions = questions.map(function(value){
      var question = value.get({plain: true});
      if(question.options){
        question.options = question.options.replace(/\s*/g, '').split(',');
      }
      return question;
    });
    res.render('index');
  });
});

/**
 * @private
 * @function answersWithOption
 * @description Helper method to build out the number of answers that have a particular option selected
 * @param {array} answers - The answers to check for an option
 * @param {string} option - The option to check for
 */
function answersWithOption(answers, option){
  var numberOfAnswers = 0;
  answers.forEach(function(answer){
    var answerOptions = answer.answer.replace(/\s*/g, '').split(',');
    if(answerOptions.indexOf(option) > -1){
      numberOfAnswers++;
    }
  });
  return numberOfAnswers;
}


/**
 * @private
 * @function answerStats
 * @description Helper method to build out statistics about the answers for a question.
 *
 * _Note: percentage is already multiplied by 100 to make rendering easier._
 * @param {Object} question - The question to build stats for
 * @return The question with the stats for the given object
 * @example
 {
   ...
   options: ['apples', 'oranges', 'bananas'],
   answerStats: [
     count: 4,
     optionStats: [
       {option: 'apples', count: 1, percentage: 25},
       {option: 'oranges', count: 1, percentage: 25},
       {option: 'bananas', count: 2, percentage: 50}
     ]
   ],
   ...
 }
 *
 */
function answerStats(question){
  question.answerStats = {
    count: question.answers.length
  }

  if(question.options){
    question.options = question.options.replace(/\s*/g, '').split(',');
    question.optionQuestion = true;
    question.answerStats.optionStats = [];
    question.options.forEach(function(option){
      var optionStat = {
        option: option,
        count: answersWithOption(question.answers, option),
      };
      optionStat.percentage = ((optionStat.count/question.answerStats.count) * 100).toFixed(1);
      question.answerStats.optionStats.push(optionStat);
    });
  }
  return question;
}

/**
 * @function /results
 * @description
 * **route**: /results
 *
 * **method**: GET
 * @return renders results
 */
router.get('/results', function(req, res){
  res.locals.pageTitle = 'Survey Results';
  req.session.returnTo = req.path;
  SurveyQuestion.findAll({
    where: {archived: false},
    include: [SurveyQuestion.Author, SurveyQuestion.Answers]
  }).then(function(questions){
    res.locals.surveyQuestions = questions.map(function(value){
      var question = value.get({plain: true});
      return question;
    });
    res.render('results');
  });
});

/**
 * @function /answer
 * @param {UUID} uuid
 * @description
 * **route**: /answer/:uuid
 *
 * **method**: GET
 *
 * _Requires authentication and admin priveleges_
 * @return renders answers for given uuid
 */
router.get('/answers/:uuid', auth.ensureAuthenticated, auth.ensureAdmin, function(req, res){
  req.session.returnTo = req.path;
  SurveyQuestion.findOne({
    where: {uuid: req.params.uuid},
    include: [
      SurveyQuestion.Author,
      {
        model: Answer,
        as: 'answers',
        include: [Answer.Author]
      }
    ]})
  .then(function(question){
    res.locals.pageTitle = 'Answers For';
    res.locals.pageSubtitle = question.question;
    var parsedQuestion = answerStats(question.get({plain: true}))
    res.locals.question = parsedQuestion;
    res.render('answers');
  });

});

/**
 * @function /login
 * @description
 * **route**: /login
 *
 * **method**: GET
 * @return renders login
 */
router.get('/login', function(req, res){
  res.locals.pageTitle = 'Login';
  res.render('login');
});

/**
 * @function /logout
 * @description
 * **route**: /logout
 *
 * **method**: GET
 * @return redirects to returnTo or '/' if no returnTo
 */
router.get('/logout', function(req, res){
  var returnPath = req.session.returnTo || '/';
  req.session.destroy();
  res.redirect(returnPath);
});

/**
 * @function /register
 * @description
 * **route**: /register
 *
 * **method**: GET
 * @return renders resgister
 */
router.get('/register', function(req, res){
  res.locals.pageTitle = 'Register';
  req.session.returnTo = '/';
  res.render('register');
});

/**
 * @function /manage
 * @description
 * **route**: /manage
 *
 * **method**: GET
 *
 * _Requires authentication and admin priveleges_
 * @return renders manage
 */
router.get('/manage', auth.ensureAuthenticated, auth.ensureAdmin, function(req, res){
  res.locals.pageTitle = 'Manage Survey';
  req.session.returnTo = req.path;
  SurveyQuestion.findAll({
    include: [SurveyQuestion.Author, SurveyQuestion.Answers]
  }).then(function(questions){
    res.locals.surveyQuestions = questions.map(function(value){
      return value.get({plain: true});
    });
    res.render('manage');
  });
});

/**
 * @function /add-question
 * @description
 * **route**: /add-question
 *
 * **method**: GET
 *
 * _Requires authentication and admin priveleges_
 * @return renders add-question
 */
router.get('/add-question', auth.ensureAuthenticated, auth.ensureAdmin, function(req, res){
  res.locals.pageTitle = 'Add Question';
  req.session.returnTo = '/manage';
  res.render('addQuestion', {
    types: SurveyQuestion.TYPES
  });
});


module.exports = router;
