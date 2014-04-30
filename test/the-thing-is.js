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

  describe("a test of a standard that doesn't exist", function(){
    it("should throw an error", function(){
      var whatIExpect = [{gonnaGetThrown:true}]
      assert.throws(function(){
        the(0).is(whatIExpect)
      }, TypeError)
    })
  })

  describe("an incorrect test of a standard", function(){
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
      assert( the.last.error.length )
    })
  })
  describe("a complex expectation that's not met", function(){
    it("doesn't meet the expectations", function(){
      the('0').is(['string', 'integerString', {gte:0, lte:100}])
      assert( the.last.error.length )
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
