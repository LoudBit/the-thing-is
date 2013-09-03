var assert = require('assert')
var the = require('../the-thing-is')

describe('the', function() {
  it('a function', function() {
    assert(typeof the === 'function')
  })
})

describe('the(subject)', function() {
  it('returns an object', function() {
    assert(typeof the('subject') === 'object')
  })
  it('with `is` property', function() {
    assert(typeof the('subject').is === 'object')
  })
  it('with `is.not` property', function() {
    assert(typeof the('subject').is === 'object')
  })
  it('with methods attached to `is` property', function() {
    assert(typeof the('subject').is === 'object')
  })
  it('with methods attached to `is.not` property', function() {
    assert(typeof the('subject').is === 'object')
  })
})


// history
// the.last
// the.past
