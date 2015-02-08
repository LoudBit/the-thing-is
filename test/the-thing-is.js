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

describe('the(thing).is', function() {
  it('is a function', function() {
    assert(typeof the('thing').is === 'function')
  })
})

describe('basic checks', function(){
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
      assert(!the.last.error)
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
      assert(!the.last.error)
    })
  })
})

describe("expectations array", function(){
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
    it('sets the.last.wasnt', function() {
      assert.deepEqual(the.last.wasnt, ['number'])
    })
  })
})

describe("expectations against a standard", function(){

  describe("the('thing').is([{gonnaGetThrown:true}])", function(){
    it("should throw an error", function(){
      var whatIExpect = [{gonnaGetThrown:true}]
      assert.throws(function(){
        the('thing').is(whatIExpect)
      }, TypeError)
    })
  })

  describe("the('0').is([{number:'wrong'}])", function(){
    it("shouldn't throw an error", function(){
      var whatIExpect = [{number:'wrong'}]
      assert.doesNotThrow(function(){
        the('0').is(whatIExpect)
      })
    })
  })

  describe("the('0')", function(){
    it(".is(['string', 'integerString', {gte: 0, lte:100}])", function(){
      var whatIExpect = [
        'string', 'integerString', {
          gte: 0,
          lte: 100
        }]
      assert( the('0').is(whatIExpect) )
    })
    it(".is([{ equal:0 }])", function(){
      assert( the('0').is([{ equal: 0 }]) )
    })
    it(".is([{ exactly: '0' }])", function(){
      assert( the('0').is([{ exactly: '0' }]) )
    })
    it(".isnt([{ equal: 1 }])", function(){
      assert( the('0').isnt([{ equal: 1 }]) )
      assert.deepEqual( the.last.wasnt, [{equal:'1'}])
    })
    it(".isnt([{ equal: '1' }])", function(){
      assert( the('0').isnt([{ equal: '1' }]) )
      assert.deepEqual( the.last.wasnt, [{equal:'1'}])
    })
  })
  describe("the('101')", function(){
    it(".isnt(['string', 'integerString', {gte: 0, lte:100}])", function(){
      var whatIExpect = [
        'string', 'integerString', {
          gte: 0,
          lte: 100
        }]
      assert( the('101').isnt(whatIExpect), false )
    })
    it("creates a meaningful error array", function(){
      assert.deepEqual( the.last.wasnt, [{lte:100}])
    })
  })
})

describe('the(thing).isnt', function() {
  it('is a function', function() {
    assert(typeof the('thing').isnt === 'function')
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
      assert(!the.last.error)
    })
  })
})

describe('testing objects', function() {

  describe('{foo:"bar"}', function() {
    var subject = { foo: "bar" }

    it('is("plainObject")', function() {
      assert.equal(the(subject).is('plainObject'), true)
    })
    it('is({ foo: "string" })', function() {
      assert.equal(the(subject).is({ foo: "string" }), true)
    })
    it('is({foo:["string"]})', function() {
      assert.equal(the(subject).is({ foo: ["string"] }), true)
    })
    it('is({bar:["string"]}) == false', function() {
      assert.equal(the(subject).is({ bar:["string"] }), false)
    })
    it('isnt({bar:["string"]})', function() {
      assert.equal(the(subject).isnt({ bar:["string"] }), true)
    })
  })


  describe('{ foo:"bar", bar:"fizz", baz:666 }', function() {
    var subject = {
      foo: 'bar',
      bar: 'fizz',
      baz: 666
    }
    it('is("plainObject")', function() {
      assert.equal(the(subject).is('plainObject'), true)
    })
    it('is({ foo:"string", bar:"string", baz:["number", {greaterThan:0}, {lessThan:777}] })', function() {
      assert.equal(the(subject).is({
        foo: 'string',
        bar: 'string',
        baz: ['number', {greaterThan:0}, {lessThan:777}]
      }), true)
    })
    it('isnt({ flop:"string", bar:"string", baz:["number", {greaterThan:0}, {lessThan:777}] })', function() {
      assert.equal(the(subject).isnt({
        flop: 'string',
        bar: 'string',
        baz: ['number', {greaterThan:0}, {lessThan:777}]
      }), true)
    })
    it('isnt({ foo:"string", bar:"string", baz:["number", {greaterThan:666}] })', function() {
      assert.equal(the(subject).isnt({
        foo: 'string',
        bar: 'string',
        baz: ['number', {greaterThan:666}]
      }), true)
    })
  })


  describe('{foo: {bar: {baz: {buz: "fiz"}}}}', function() {
    var subject = {
      foo: {
        bar: {
          baz: {
            buz: 'fiz'
          }
        }
      }
    }
    it('is("plainObject")', function() {
      assert.equal(the(subject).is('plainObject'), true)
    })
    it('is({foo: {bar: {baz: {buz: ["string"]}}}})', function() {
      assert.equal(the(subject).is({foo: {bar: {baz: {buz: ['string']}}}}), true)
    })
    it('isnt({foo: {bar: {baz: {buz: ["number"]}}}}) - wrong type', function() {
      assert.equal(the(subject).isnt({foo: {bar: {baz: {buz: ['number']}}}}), true)
    })
    it('isnt({foo: {bar: {baz: {buz: {fiz: ["string"]}}}}}) - nested too deep', function() {
      assert.throws(function(){
        the(subject).isnt({foo: {bar: {baz: {buz: {fiz: ['string']}}}}})
      }, TypeError)
    })
  })

  describe('{foo: {bar: {baz: {buz: "fiz"}}}}', function() {
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

    it('is("plainObject")', function() {
      assert.equal(the(subject).is('plainObject'), true)
    })
    it('is({foo: {bar: {baz: {buz: ["string"]}}}})', function() {
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
    it('isnt({foo: {bar: {baz: {buz: ["number"]}}}}) - foo not at top level', function() {
      assert.equal(the(subject).isnt({foo: {bar: {baz: {buz: ['number']}}}}), true)
      assert.deepEqual(the.last.wasnt, [{'foo':'present'}])
    })
  })


})


