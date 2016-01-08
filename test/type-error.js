/* jshint quotmark:false */
/* global describe, it, before */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe('the({ foo:undefined })', function () {
  describe(".is({ foo:'undef' }", function () {
    it('returns true', function () {
      assert(
        the({ foo: undefined })
        .is({ foo: 'undef' })
      )
    })
    it('sets no error', function () {
      assert.deepEqual(the.last.error, [])
    })
  })
})

describe('the({ foo:undefined })', function() {
  describe(".is({ foo:['present'] }", function () {
    it('returns false', function () {
      assert.equal(
        the({ foo:undefined }).is({ foo: ['present'] }),
        false
      )
    })
    it('sets the right error', function () {
      assert.deepEqual(the.last.error, [{ foo: ['present'] }])
    })
  })
})
