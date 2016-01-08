/* jshint quotmark:false */
/* global describe, it */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe('TESTING OBJECTS', function() {

  describe('the({foo:"bar"})', function() {
    var subject = { foo: "bar" }

    describe('.is("plainObject")', function() {
      it('returns true', function() {
        assert.equal(the(subject).is('plainObject'), true)
      })
    })
    describe('.is({ foo: "string" })', function() {
      it('returns true', function() {
        assert.equal(the(subject).is({ foo: "string" }), true)
      })
    })
    describe('.is({foo:["string"]})', function() {
      it('returns true', function() {
        assert.equal(the(subject).is({ foo: ["string"] }), true)
      })
    })
    describe('.is({bar:["string"]})', function() {
      it('returns false', function() {
        assert.equal(the(subject).is({ bar:["string"] }), false)
      })
    })
  })


  describe('the({ foo:"bar", fizz:"buzz", baz:666 })', function() {
    var subject = {
      foo: 'bar',
      fizz: 'buzz',
      diablo: 666
    }

    describe('.is({ foo:"string", fizz:"string", diablo:["number", {greaterThan:0}, {lessThan:777}] })', function() {
      it('returns true', function() {
        assert.equal(the(subject).is({
          foo: 'string',
          fizz: 'string',
          diablo: ['number', {greaterThan:0}, {lessThan:777}]
        }), true)
      })
    })
  })


  describe('the({foo: {bar: {baz: {buz: "fiz"}}}})', function() {
    var subject = {
      foo: {
        bar: {
          baz: {
            buz: 'fiz'
          }
        }
      }
    }
    describe('.is({foo: {bar: {baz: {buz: ["string"]}}}})', function() {
      it('returns true', function() {
        assert.equal(the(subject).is({foo: {bar: {baz: {buz: ['string']}}}}), true)
      })
    })
  })

  describe('the({foo: {bar: {baz: {buz: "fiz"}}}})', function() {
    var subject = {
      fo: {
        foo: {
          fooo: 'fooo'
        },
        oof: {
          ooof: 'ooof'
        }
      },
      bar: {
        baz: {
          buz: 'buz'
        },
        rab: {
          zub: 'zub'
        },
        zab: 'zab'
      }
    }
    describe('is({foo: {bar: {baz: {buz: ["string"]}}}})', function() {
      it('returns true', function() {
        var whatIExpect = {
          fo: {
            foo: {
              fooo: 'string'
            },
            oof: {
              ooof: 'string'
            }
          },
          bar: {
            baz: {
              buz: 'string'
            }
          }
        }
        assert.equal(the(subject).is(whatIExpect), true)
      })
    })
  })
})
