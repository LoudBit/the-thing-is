// The Thing Is
// Configuration driven validation
// with the goal of a near-english syntax

// Usage:
//
// var whatYouExpect = 'number'  --  string (least useful)
// var whatYouExpect = ['present', 'number', {greaterThan:0}] -- array (tightest to write, preferred?)
// var whatYouExpect = {present:true, number:true, greaterThan:0} -- object (verbose, unreliable order)
// var whatYouExpect = [{present:true}, {number:true}, {greaterThan:0}] -- array of objects (very verbose, reliable order)
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

    var its = true

    // the(thing).is()
    // undefined or null -- check mere presence of a thing
    if ( is.not.present(whatYouExpect) ) {
      its = is.present(the.last.thing)
    }

    // 'present' -- single boolean check
    // the(thing).is('integer') // true/false
    // the(thing).is('borkborkbork') // throw
    if ( is.string(whatYouExpect) )
      its = simplyCheck(whatYouExpect)


    // ['present', 'number'] -- array of boolean
    if ( is.array(whatYouExpect) ) {
      for (var i = 0; i < whatYouExpect.length && its == true; i++) {
        if (is.string(whatYouExpect[i]))
          its = simplyCheck(whatYouExpect[i])
        if (!its)
          the.last.error = '' + the.last.thing + ' is not ' + whatYouExpect[i];
      }
    }
    // {greaterThan:0} -- configuration object with single condition
    // {present:true, integer:true, greaterThan:0} -- unreliable due to unreliable hash key order
    // [{present:true}, {integer:true}, {greaterThan:0}] -- reliable, but verbose
    // ['present', 'integer', {greaterThanOrEqualTo:0}] -- preferred

    return its
  },
  isnt: function(whatYouExpect) {
    return !this.is(whatYouExpect)
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

function simplyCheck(expectation) {
  if (is[expectation])
    return is[expectation](the.last.thing)
  else
    throw new TypeError("`"+expectation+"` isn't a valid comparison method.")
}


for (method in is) {
  if (is.hasOwnProperty(method) && typeof is[method] == 'function') {
    // create the(thing).is.whatever()
    comparisons.is[method] = (isProxy)(method)
    comparisons.isnt[method] = (isntProxy)(method)
  }
}

module.exports = the
