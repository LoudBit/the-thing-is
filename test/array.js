/* jshint quotmark:false */
/* global describe, it */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe("EXPECTATIONS ARRAY", function(){
  describe("the(0).is(['integer'])", function() {
    it('returns true', function() {
      assert.equal(the(0).is(['integer']), true)
    })
  })
  describe("the(0).is(['string'])", function() {
    it('returns false', function() {
      assert.equal(the(0).is(['string']), false)
    })
  })
  describe("the('0').is(['string', 'numberString', 'integerString'])", function() {
    it('returns true', function() {
      assert.equal(the('0').is(['string', 'numberString', 'integerString']), true)
    })
  })
  describe("the('0').is(['string', 'number', 'integer'])", function() {
    it('returns false', function() {
      assert.equal(the('0').is(['string', 'number', 'integer']), false)
    })
    it('sets the.last.error', function() {
      assert.deepEqual(the.last.error, ['number', 'integer'])
    })
  })
})
