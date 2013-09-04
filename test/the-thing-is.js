var assert = require('assert')
var the = require('../the-thing-is')

describe('the', function() {
  it('a function', function() {
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

describe("the(0).is(['integer'])", function() {
  it('returns true', function() {
    assert.equal(the(0).is(['integer']), true)
  })
})

describe('the(thing).isnt', function() {
  it('is a function', function() {
    assert(typeof the('thing').isnt === 'function')
  })
})

describe("the(0).isnt(['integer'])", function() {
  it('returns false', function() {
    assert.equal(the(0).isnt(['integer']), false)
  })
})

