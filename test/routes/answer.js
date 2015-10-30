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

var app = require(path.join(__baseDir, 'lib/app'));
var chai = require('chai');
var request = require('supertest');
var sequelizeFixtures = require('sequelize-fixtures');

var answerRouter = require(path.join(__baseDir, 'lib/routes/answer'));
var User = require(path.join(__baseDir, 'lib/models/User'));
var Provider = require(path.join(__baseDir, 'lib/models/Provider'));
var Answer = require(path.join(__baseDir, 'lib/models/Answer'));
var SurveyQuestion = require(path.join(__baseDir, 'lib/models/SurveyQuestion'));

var models = {
  User: User,
  Provider: Provider,
  Answer: Answer,
  SurveyQuestion: SurveyQuestion
};
var should = chai.should();

var agent = request.agent(app);

describe('routes/answer', function () {
  beforeEach(function(done){
    __db.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true}).then(function(){
      return __db.sync({force: true}).then(function() {
        return sequelizeFixtures.loadFile(path.join(__baseDir, 'test/fixtures/db.js'), models).then(function(){
          return done();
        });
      });
    }).catch(function(error){
      done(error);
    });
  });
  describe("#accept", function(){
    var question;
    beforeEach(function(done){
      SurveyQuestion.findOne({}).then(function(finalQuestion){
        question = finalQuestion.get({plain: true});
        done();
      }).catch(function(error){
        done(error);
      })
    });

    it('should accept and answer from an anonymous user', function(done){
      agent.post('/api/v1/answer')
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
    it('should accept multiple answers for the same question', function(done){
      agent.post('/api/v1/answer')
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
          agent.post('/api/v1/answer')
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
