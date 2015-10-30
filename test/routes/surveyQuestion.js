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

var app = require(path.join(__baseDir, 'lib/app'));

var chai = require('chai');
var request = require('supertest');
var sequelizeFixtures = require('sequelize-fixtures');
var Sequelize = require('sequelize');

var models = {
  User: require(path.join(__baseDir, 'lib/models/User')),
  Provider: require(path.join(__baseDir, 'lib/models/Provider')),
  Answer: require(path.join(__baseDir, 'lib/models/Answer')),
  SurveyQuestion: require(path.join(__baseDir, 'lib/models/SurveyQuestion'))
};
var should = chai.should();

var agent = request.agent(app);

describe('routes/survey-question', function () {
  beforeEach(function(done){
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
  it('should not accept a question from anonymous', function(done){
    agent.post('/api/v1/survey-question/secure/')
      .type('form')
      .send({question: 'Who are we?'})
      .expect(401)
      .end(done)
  });
  it('should accept a question from an admin', function(done){
    agent.post('/auth/local')
      .type('form')
      .send({username: 'john@smith.foo'})
      .send({password: 'p@$$w0rd'})
      .expect(302)
      .expect('location', '/')
      .end(function(error){
        if(error){
          return done(error);
        }
        agent.post('/api/v1/survey-question/secure/')
          .type('form')
          .send({question: 'Who are we?'})
          .send({options: ''})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(done)
      });
  });
  it('should not accept a question from a subscriber', function(done){
    agent.post('/auth/local')
      .type('form')
      .send({username: 'bob@anderson.foo'})
      .send({password: 'secret'})
      .expect(302)
      .expect('location', '/')
      .end(function(error){
        if(error){
          return done(error);
        }
        agent.post('/api/v1/survey-question/secure/')
          .type('form')
          .send({question: 'Who are we?'})
          .send({options: ''})
          .expect(403)
          .end(done)
      });
  });
  describe('#removal', function(){
    var question;
    beforeEach(function(done){
      agent.post('/auth/local')
        .type('form')
        .send({username: 'john@smith.foo'})
        .send({password: 'p@$$w0rd'})
        .expect(302)
        .expect('location', '/')
        .end(function(error){
          if(error){
            return done(error);
          }
          agent.post('/api/v1/survey-question/secure/')
            .type('form')
            .send({question: 'Who are those Monkeys jumping on the bed?'})
            .send({options: ''})
            .expect(200)
            .expect(function(res){
              question = res.body;
            })
            .end(done)
        });
    });

    it('should delete a question', function(done){
      agent.delete('/api/v1/survey-question/secure/' + question.uuid)
        .expect(200)
        .end(function(error){
          if(error){
            return done(error);
          }
          agent.get('/api/v1/survey-question/secure/' + question.uuid)
            .expect(404)
            .end(done);
        });
    });

    describe('#archive/unarchive', function(){
      beforeEach(function(done){
        agent.get('/api/v1/survey-question/secure/archive/' + question.uuid)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(done);
      });
      it('should archive a question', function(done){
        agent.get('/api/v1/survey-question/secure/' + question.uuid)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res){
            res.body.should.have.property.uuid;
            res.body.question.should.equal('Who are those Monkeys jumping on the bed?');
            res.body.archived.should.equal(true);
          })
          .end(done);
      });
      it('should unarchive a question', function(done){
        agent.get('/api/v1/survey-question/secure/unarchive/' + question.uuid)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(error){
            if(error){
              return done(error);
            }
            agent.get('/api/v1/survey-question/secure/' + question.uuid)
              .expect(200)
              .expect(function(res){
                res.body.should.have.property.uuid;
                res.body.question.should.equal('Who are those Monkeys jumping on the bed?');
                res.body.archived.should.equal(false);
              })
              .end(done);
          });
      });
    });
  });
});
