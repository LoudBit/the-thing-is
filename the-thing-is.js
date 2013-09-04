// The Thing Is
// Configuration driven validation
// with the goal of near-english syntax

// Usage:
//
// var whatYouExpect = 'number'  --  string (least useful)
// var whatYouExpect = ['present', 'number', {greaterThan:0}] -- array (tightest to write)
// var whatYouExpect = {present:true, number:true, greaterThan:0} -- object (verbose, unreliable order)
//
// if (the(thing).is(whatYouExpect)) {
//   fuckYeah()
// }
//
// if (the(thing).isnt(whatYouExpect)) {
//   throwSomething()
// }

// Dependencies
var is = require('is-it')
var method


function the(thing) {
  the.past.push({ thing:thing })
  the.last = the.past[the.past.length-1 || 0]
  return comparisons
}

the.past = []
the.last = null

// is, isnt, is.not
var comparisons = {
  is: function(whatYouExpect) {
    // 'present' -- single boolean check
    // ['present', 'number'] -- array of boolean
    // {greaterThan:0} -- configuration object with single condition
    // {present:true, integer:true, greaterThan:0} -- unreliable due to unreliable hash key order
    // [{present:true}, {integer:true}, {greaterThan:0}] -- reliable, but verbose
    // ['present', 'integer', {greaterThanOrEqualTo:0}] -- preferred
  },
  isnt: function(whatYouExpect) {

  }
}

function isProxy(config) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(the.last.subject)
    if ( !the.last.error && is.not[method].apply(this, args) ) {
      the.error(method)
    }
  }
}

function isntProxy(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(the.last.subject)
    if (!the.last.error && is[method].apply(this, args)) {
      the.error(method)
    }
    return comparisonOperators.isnt
  }
}


for (method in is) {
  if (is.hasOwnProperty(method) && typeof is[method] == 'function') {
    // create the(thing).is.whatever()
    comparisons.is[method] = (isProxy)(method)
    comparisons.isnt[method] = (isntProxy)(method)
  }
}

module.exports = the
