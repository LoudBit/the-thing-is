/* jshint quotmark:false */
/* global describe, it, before */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe('the', function() {
  it('is a function', function() {
    assert(typeof the === 'function')
  })
})

describe('the(thing)', function() {
  it('returns an object', function() {
    assert(typeof the('thing') === 'object')
  })
})

describe('BASIC CHECKS', function(){
  describe('.is', function () {
    describe('the(thing).is', function() {
      it('is a function', function() {
        assert(typeof the('thing').is === 'function')
      })
    })

    describe('the.last', function(){
      before(function(){
        var result = the('thing').is('string')
        assert(result)
      })
      it('stores the.last.thing', function(){
        assert.equal(the.last.thing, 'thing')
      })
      it('creates the.last.error as an empty array', function(){
        assert(the.last.error)
        assert(Array.isArray(the.last.error))
        assert.equal(the.last.error.length, 0)
      })
      it('changes the next time `the` is called', function(){
        the('thing2').is('string')
        assert.equal(the.last.thing, 'thing2')
        assert.deepEqual(the.last.error, [])
      })
    })

    describe('the().is()', function(){
      it('returns false', function() {
        assert.equal(the().is(), false)
      })
    })
    describe("the('thing').is()", function() {
      it('returns true', function() {
        assert.equal(the('thing').is(), true)
      })
    })
    describe("the(0).is('integer')", function() {
      it('returns true', function() {
        assert.equal(the(0).is('integer'), true)
      })
      it("doesn't set an error", function() {
        assert(the.last.thing === 0)
        assert(!the.last.error.length)
      })
    })
    describe("the('thing').is('gonnaGetThrown')", function() {
      it('throws a TypeError', function() {
        assert.throws(function(){
          the('thing').is('gonnaGetThrown')
        }, TypeError)
      })
      it("doesn't set an error", function() {
        assert.equal(the.last.thing, 'thing')
        assert(!the.last.error.length)
      })
    })
  })
})
