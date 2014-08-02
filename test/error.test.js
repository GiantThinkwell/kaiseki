var assert = require('assert');
var config = require('./config');
var should = require('should');
var async = require('async');
var Kaiseki = require('../lib/kaiseki');
var _ = require('underscore');

var className = 'Dogs';
var parse = new Kaiseki(config.PARSE_APP_ID, config.PARSE_REST_API_KEY);

describe('error', function() {

  beforeEach(function() {
    this.getResponseHandler = function getResponseHandler(handler) {

      return function responseHandler() {
        var callback = _.last(arguments);
        if (!_.isFunction(callback)) {
          handler();
        } else {
          handler(callback);
        }
      }
    };

    this.setClient = function(request) {
      this.request = request;
      this.parse = new Kaiseki({
        applicationId: config.PARSE_APP_ID,
        restAPIKey: config.PARSE_REST_API_KEY,
        request: this.request
      });
      return this.parse;
    };
  });

  it('can handle an undefined response', function(done) {
    this.setClient(this.getResponseHandler(function(callback) {
      callback(null, {
        statusCode: 502,
        headers: {
          'content-type': 'application/json'
        }
      });
    }));
    this.parse.createObject('Dogs', {}, function(err, res, body, success) {
      assert.equal(err, null);
      assert.equal(body, undefined);
      success.should.be.false;
      done();
    });
  });

});
