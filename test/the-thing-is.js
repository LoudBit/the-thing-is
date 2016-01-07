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
  describe('.isnt', function() {
    describe('the(thing).isnt', function() {
      it('is a function', function() {
        assert(typeof the('thing').isnt === 'function')
      })
    })
    describe('the().isnt()', function() {
      it('returns true', function() {
        assert.equal(the().isnt(), true)
      })
    })
    describe("the('thing').isnt()", function() {
      it('returns false', function() {
        assert.equal(the('thing').isnt(), false)
      })
    })
    describe("the(0).isnt('integer')", function() {
      it('returns false', function() {
        assert.equal(the(0).isnt('integer'), false)
      })
    })
    describe("the(0).isnt(['integer'])", function() {
      it('returns false', function() {
        assert.equal(the(0).isnt(['integer']), false)
      })
    })
    describe("the('thing').isnt('gonnaGetThrown')", function() {
      it('throws a TypeError', function() {
        assert.throws(function(){
          the('thing').isnt('gonnaGetThrown')
        }, TypeError)
      })
      it("doesn't set an error", function() {
        assert.equal(the.last.thing, 'thing')
        assert(!the.last.error.length)
      })
    })
  })
})

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

describe("EXPECTATIONS AGAINST A STANDARD", function(){

  describe("the('0')", function(){
    describe(".is([{gonnaGetThrown:true}])", function(){
      it("throws an error", function(){
        var whatIExpect = [{gonnaGetThrown:true}]
        assert.throws(function(){
          the('thing').is(whatIExpect)
        }, TypeError)
      })
    })
    describe(".is([{number:'wrong'}])", function(){
      it("doesn't throw an error", function(){
        var whatIExpect = [{number:'wrong'}]
        assert.doesNotThrow(function(){
          the('0').is(whatIExpect)
        })
      })
    })
    describe(".is(['string', 'integerString', {gte: 0, lte:100}])", function() {
      it('returns true', function(){
        var whatIExpect = [
          'string', 'integerString', {
            gte: 0,
            lte: 100
          }]
        assert( the('0').is(whatIExpect) )
      })
    })
    describe(".is([{ equal:0 }])", function(){
      it('returns trur', function(){
        assert( the('0').is([{ equal: 0 }]) )
      })
    })

    describe(".is([{ exactly: '0' }])", function(){
      it("returns true", function(){
        assert( the('0').is([{ exactly: '0' }]) )
      })
    })
    describe(".isnt([{ equal: 1 }])", function(){
      it("returns true", function(){
        assert(the('0').isnt([{ equal:1 }]))
      })
      it("sets the.last.error to [{equal:1}]", function () {
        assert.deepEqual(the.last.error, [{equal:1}])
      })
    })
    describe(".isnt([{ equal: '1' }])", function(){
      it("returns true", function(){
        assert( the('0').isnt([{ equal: '1' }]) )
      })
      it("sets the.last.error to [{equal:'1'}]", function () {
        assert.deepEqual( the.last.error, [{equal:'1'}])
      })
    })
  })
  describe("the('101')", function(){
    describe(".isnt(['string', 'integerString', {gte: 0, lte:100}])", function(){
      it('returns true', function(){
        assert(the('101').isnt(['string', 'integerString', { gte: 0, lte: 100 }]))
      })
      it("creates a meaningful error array", function(){
        assert.deepEqual( the.last.error, [{lte:100}])
      })
    })
  })
})


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
    describe('.isnt({bar:["string"]})', function() {
      it('returns true', function() {
        assert.equal(the(subject).isnt({ bar:["string"] }), true)
      })
    })
  })


  describe('the({ foo:"bar", fizz:"buzz", baz:666 })', function() {
    var subject = {
      foo: 'bar',
      fizz: 'buzz',
      diablo: 666
    }
    describe('.is("plainObject")', function() {
      it('returns true', function() {
        assert.equal(the(subject).is('plainObject'), true)
      })
    })

    describe('.is({ foo:"string", fizz:"string", diablo:["number", {greaterThan:0}, {lessThan:777}] })', function() {
      it('returns true', function() {
        assert.equal(the(subject).is({
          foo: 'string',
          fizz: 'string',
          diablo: ['number', {greaterThan:0}, {lessThan:777}]
        }), true)
      })
    })

    describe('.isnt({ flop:"string", bar:"string", diablo:["number", {greaterThan:0}, {lessThan:777}] })', function() {
      var result
      before(function(){
        result = the(subject).isnt({
          flop: 'string',
          bar: 'string',
          diablo: ['number', {greaterThan:0}, {lessThan:777}]
        })
      })
      it('returns true', function() {
        assert(result, 'the thing returned the wrong result')
      })
      it('sets a useful error', function() {
        assert.deepEqual(the.last.error, [
          { flop: [ 'present' ] },
          { bar: [ 'present' ] }
        ])
      })
    })

    describe('.isnt({ foo:"string", bar:"string", diablo:["number", {greaterThan:666}] })', function() {
      var result
      before(function(){
        result = the(subject).isnt({
          flop: 'string',
          bar: 'string',
          diablo: ['number', {greaterThan:0}, {lessThan:777}]
        })
      })
      it('returns true', function() {
        assert(result, 'the thing returned the wrong result')
      })
      it('sets a useful error', function() {
        assert.deepEqual(the.last.error, [
          { flop: [ 'present' ] },
          { bar: [ 'present' ] }
        ])
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
    describe('.is("plainObject")', function() {
      it('returns true', function() {
        assert.equal(the(subject).is('plainObject'), true)
      })
    })
    describe('.is({foo: {bar: {baz: {buz: ["string"]}}}})', function() {
      it('returns true', function() {
        assert.equal(the(subject).is({foo: {bar: {baz: {buz: ['string']}}}}), true)
      })
    })
    describe('.isnt({foo: {bar: {baz: {buz: ["number"]}}}}) - wrong type', function() {
      it('returns true', function() {
        assert.equal(the(subject).isnt({foo: {bar: {baz: {buz: ['number']}}}}), true)
      })
    })
    describe('.isnt({foo: {bar: {baz: {buz: {fiz: ["string"]}}}}})', function() {
      it("throws a type error because fiz doesn't exist", function() {
        assert.throws(function(){
          the(subject).isnt({foo: {bar: {baz: {buz: {fiz: ['string']}}}}})
        }, TypeError)
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

    describe('is("plainObject")', function() {
      it('returns true', function() {
        assert.equal(the(subject).is('plainObject'), true)
      })
    })
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
    describe('.isnt({foo: {bar: {baz: {buz: ["number"]}}}}) - foo not at top level', function() {
      it('returns true', function() {
        assert.equal(the(subject).isnt({foo: {bar: {baz: {buz: ['number']}}}}), true)
        assert.deepEqual(the.last.error, [{'foo':['present']}])
      })
    })
  })
})

describe('THINGS WITH MULTIPLE ERRORS', function() {
  describe("the('thing')", function() {
    describe(".is(['number', {greaterThan:0}, {lessThan:1000}])", function() {
      before(function(){
        the('thing').is(['number', {greaterThan:0}, {lessThan:1000}])
      })
      it("reports thing isn't a number", function(){
        assert.equal( the.last.error[0], 'number')
      })
      it("reports thing isn't greaterThan:0", function(){
        assert.deepEqual( the.last.error[1], {greaterThan:0})
      })
      it("reports thing isn't lessThan:1000", function(){
        assert.deepEqual( the.last.error[2], {lessThan:1000})
      })
    })
  })

  describe("the({ foo: 1, bar: 2, fizz: { buzz: 'fizzbuzz' }})", function(){
    describe(".is({ foo: ['number'], bar: ['string'], fizz: { buzz: ['number', {greaterThan:0}] } })", function() {
      before(function(){
        the({
          foo: 1,
          bar: 2,
          fizz: {
            buzz: 'fizzbuzz'
          }
        }).is({
          foo: ['number'],
          bar: ['string'],
          fizz: {
            buzz: ['number', {greaterThan:0}]
          }
        })
      })
      it("reports `bar` isn't a string", function(){
        assert.deepEqual( the.last.error[0], {bar:['string']})
      })
      it("reports `fizz.buzz` has errors", function(){
        assert.deepEqual(the.last.error[1], {
          'fizz.buzz': [
            'number',
            { greaterThan:0 }
          ]
        })
      })
      it("reports `fizz.buzz` has isn't a number", function(){
        assert.deepEqual(the.last.error[1]['fizz.buzz'][0], 'number')
      })
      it("reports `fizz.buzz` has isn't greaterThan:0", function(){
        assert.deepEqual(the.last.error[1]['fizz.buzz'][1], {greaterThan:0})
      })
    })
  })
})

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
      it('returns false', function () {
        assert.equal(the().is('present'), false)
      })
      it('sets the correct error', function () {
        assert(the.last.error.length)
        assert.deepEqual(the.last.error, ['present'])
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

  describe('the({ foo:undefined })', function() {
    describe(".is({ foo:['present'] }", function () {
      it('returns true', function () {
        assert(the({ foo:undefined }).is({ foo: ['present'] }))
      })
    })
  })

})
