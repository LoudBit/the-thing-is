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
  describe('the().is()', function() {
    it('returns false', function() {
      assert.equal(the().is(), false)
    })
  })
  describe('the(thing).is()', function() {
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
  describe("the('0').is(['string', 'aNumber', 'aInteger'])", function() {
    it('returns true', function() {
      assert.equal(the('0').is(['string', 'aNumber', 'aInteger']), true)
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
})

