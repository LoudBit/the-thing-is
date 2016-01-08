/* jshint quotmark:false */
/* global describe, it, before */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe('FALSY VALUES', function () {
  describe("the()", function () {
    describe(".is('undef')", function () {
      it('returns true', function () {
        assert(the().is('undef'))
      })
    })
    describe(".is('present')", function () {
      it('returns false', function () {
        assert.equal(the().is('present'), false)
      })
      it('sets the correct error', function () {
        assert(the.last.error.length)
        assert.deepEqual(the.last.error, ['present'])
      })
    })
  })
  describe("the(false)", function () {
    describe(".is('false')", function () {
      it('returns true', function () {
        assert(the(false).is('false'))
      })
    })
    describe(".is('present')", function () {
      it('returns true', function () {
        assert.equal(the(false).is('present'), true)
      })
      it('sets no error', function () {
        assert(!the.last.error.length)
        assert.deepEqual(the.last.error, [])
      })
    })
  })
  describe('the({ foo:undefined })', function() {
    describe(".is({ foo:'undef' }", function () {
      it('returns true', function () {
        assert(the({ foo: undefined }).is({ foo: 'undef' }))
      })
    })
    describe(".is({ foo:'number' }", function () {
      var result
      before(function () {
        result = the({ foo: undefined }).is({ foo: 'number' })
      })
      it('returns false', function () {
        assert.equal(result, false)
      })
      it('sets the correct error', function () {
        assert(the.last.error.length)
        assert.deepEqual(the.last.error, [{foo:['number']}])
      })
    })
  })
})
