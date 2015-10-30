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
 * @module test/models/Answer
 * @description Test model Answer.
 */
var path = require('path');

require(path.join(__baseDir, 'test/fixtures/dbUtil'));

var chai = require('chai');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var sequelizeFixtures = require('sequelize-fixtures');
var Sequelize = require('sequelize');

var answerRouter = require(path.join(__baseDir, 'lib/routes/answer'));

var models = {
  User: require(path.join(__baseDir, 'lib/models/User')),
  Provider: require(path.join(__baseDir, 'lib/models/Provider')),
  Answer: require(path.join(__baseDir, 'lib/models/Answer')),
  SurveyQuestion: require(path.join(__baseDir, 'lib/models/SurveyQuestion'))
};
var should = chai.should();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', answerRouter);
var agent = request.agent(app);

describe('routes/answer', function () {
  before(function(done){
    __db.sync({force: true}).then(function() {
      sequelizeFixtures.loadFile(path.join(__baseDir, 'test/fixtures/db.js'), models).then(function(){
        done();
      }).catch(function(error){
        done(error);
      });
    }).catch(function(error) {
      done(error);
    });
  });
  beforeEach(function(done){
    models.Answer.sync({force: true}).then(function(){
      done();
    }).catch(function(error){
      done(error);
    });
  })
  it('should accept and answer from an anonymous user', function(done){
    models.SurveyQuestion.findOne({}).then(function(question){
      agent.post('/')
        .send('question-' + question.uuid + '=apples')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res){
          res.body[0].should.have.property.uuid;
          res.body[0].answer.should.equal('apples');
          res.body[0].surveyQuestionUuid.should.equal(question.uuid);
        })
        .end(done);
    });
  });
  it('should accept multiple answers for the same question', function(done){
    models.SurveyQuestion.findOne({}).then(function(question){
      agent.post('/')
        .send('question-' + question.uuid + '=apples')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res){
          res.body[0].should.have.property.uuid;
          res.body[0].answer.should.equal('apples');
          res.body[0].surveyQuestionUuid.should.equal(question.uuid);
        })
        .end(function(err){
          if(err){
            return done(err);
          }
          agent.post('/')
            .send('question-' + question.uuid + '=oranges')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
              res.body[0].should.have.property.uuid;
              res.body[0].answer.should.equal('oranges');
              res.body[0].surveyQuestionUuid.should.equal(question.uuid);
            })
            .end(done);
        });
    });
  });
});
