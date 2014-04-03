// The Thing Is
// Configuration driven validation
// with the goal of a near-english syntax (for consumers)

// Usage:
//
// var whatYouExpect = 'number'  --  string (least useful)
// var whatYouExpect = ['present', 'number', {greaterThan:0}] -- array (tightest to write, preferred?)
// var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}] -- combo v2, maintains order, groups comparisons that are chaotic
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


// the -- function you care about
function the(thing) {
  the.past.push({
    thing:  thing,
    errors: []
  })
  the.last = the.past[the.past.length-1 || 0]
  return comparisons
}

the.past = []
the.last = null

// is, isnt
var comparisons = {
  is: function(whatYouExpect) {

    var its = true
    var expectation = null

    // the(thing).is()
    // whatYouExpect is undefined or null -- so check mere presence of a thing
    if ( is.not.present(whatYouExpect) )
      its = is.present(the.last.thing)

    // 'present' -- single boolean check
    // the(thing).is('integer') // true/false
    // the(thing).is('borkborkbork') // throw
    else
      if ( is.string(whatYouExpect) )
        its = booleanCheck(whatYouExpect)


    // ['present', 'number'] -- array of boolean
    // the(thing).is(['present', 'integer'])
    else
      if ( is.array(whatYouExpect) )
        for (var i = 0; i < whatYouExpect.length && its == true; i++) {
          expectation = whatYouExpect[i]
          if (is.string(expectation))
            its = booleanCheck(expectation)
          else
            its = subjectCheck(expectation)

          if (!its)
            the.last.error = '' + the.last.thing + ' is not ' + whatYouExpect[i];
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

// simple yes/no type comparisons against an expectation
function booleanCheck(expectation) {
  if (is[expectation])
    return is[expectation](the.last.thing)
  else
    throw new TypeError("`"+expectation+"` isn't a valid comparison method.")
}

function subjectCheck(expectation) {
  the.last.error = []

  // loop through the keys in the object to
  Object.keys(expectation).forEach(function(key, value){
    if ( !is[key] )
      throw new TypeError("`"+key+"` isn't a valid comparison method.")

    if ( is[key](the.last.thing, expectation[key]) ) {
      the.last.error.push(['See, the thing is, ', the.last.thing, ' (', typeof the.last.thing, ') isn\'t ', key, ' ', value, '.'].join(''));
    }
  })

  return !!the.last.error.length
}


module.exports = the
