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
    it('sets the.last.error', function() {
      assert(the.last.error)
    })
  })
})

describe("expectations against a standard", function(){

  describe("the(0).is([{gonnaGetThrown:true}])", function(){
    it("should throw an error", function(){
      var whatIExpect = [{gonnaGetThrown:true}]
      assert.throws(function(){
        the(0).is(whatIExpect)
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

  describe("a complex expectation that passes", function(){
    it('passes all the conditions', function(){
      var whatIExpect = [
        'string', 'integerString',
        {
          // this is a trick - `number:false` is true
          // because `number` isn't a check against a standard
          number: false,
          integerString: true,
          gte: 0,
          lte: 100
        }
      ]
      assert( the('0').is(whatIExpect) )
      // assert( the.last.error.length )
    })
  })
  describe("a complex expectation that's not met", function(){
    it("doesn't meet the expectations", function(){
      assert( !the('0').is(['string', 'integerString', {gte:0, lte:100}]) )
      // assert( the.last.error.length )
    })
    it("sets a meaningful (enough) error message", function(){
      assert.equal( the.last.error[0], "See, the thing is, 0 (string) isn't gte 0.")
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
      assert.equal(the(subject).is({ foo: "string" }), true)
    })
    it('is(["plainObject"])', function() {
      assert.equal(the(subject).is({ foo: "string" }), true)
    })
    it('is({foo:"string"})', function() {
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
      assert.equal(the(subject).isnt({foo: {bar: {baz: {buz: {fiz: ['string']}}}}}), true)
    })
  })

})


