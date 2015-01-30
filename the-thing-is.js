// The Thing Is
//
// Detailed Object Descriptions
// ...with a sort of _artistic_ quality of code
//
// Usage:
//
// var whatYouExpect = 'number'  --  string (least useful)
// var whatYouExpect = ['present', 'number', {greaterThan:0}] -- array (tightest to write, preferred?)
// var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}] -- combo v2, maintains order, groups comparisons that are chaotic
// var whatYouExpect = [{present:true}, {number:true}, {greaterThan:0}] -- array of objects (very verbose, reliable order, overkill)
//
// if (the(thing).is(whatYouExpect)) {
//   ohYeah()
// }
//
// if (the(thing).isnt(whatYouExpect)) {
//   throwSomething()
// }

'use strict'

// Dependencies
var is = require('is-too')


// the -- function you care about
function the(thing) {
  the.past = the.past || []
  the.past.push({
    thing:  thing,
    errors: []
  })
  the.last = the.past[Math.max(the.past.length-1, 0)]
  return isAndIsnt
}


// is, isnt
var isAndIsnt = {
  is: whatItIs,
  isnt: function(whatYouExpect, thing) {
    return !this.is(whatYouExpect, thing)
  }
}


// will recursively compare the thing against the provided description
function whatItIs(whatYouExpect, thing) {

  var its = true
  thing = thing || the.last.thing

  // the(thing).is()
  // whatYouExpect is undefined or null -- so check mere presence of a thing
  if ( is.not.present(whatYouExpect) )
    its = is.present(thing)

  // 'present' -- single boolean check
  // the(thing).is('integer') // true/false
  // the(thing).is('borkborkbork') // throw
  else
    if ( is.string(whatYouExpect) )
      its = check(whatYouExpect, thing) // to be


  // ['present', 'number'] -- array of boolean comparisons
  // the(thing).is(['present', 'integer'])
  else
    if ( is.array(whatYouExpect) )
      whatYouExpect.every(function(expected){
        if (is.string(expected))
          its = check(expected, thing)
        else
          its = measure(expected, thing)
        if (!its)
          the.last.error = '' + thing + ' is not ' + expected;
        return its
      })

  // { foo: ['bar'] } -- dictionary describing complex or deep objects
  // the(thing).is({ name: ['present', 'string'], address: { street: 'string', city: 'string', state: 'string', zip: 'string' })
  else
    if ( is.plainObject(whatYouExpect) ) {
      its = Object.keys(whatYouExpect).every(function(key){
        return whatItIs(whatYouExpect[key], thing[key]);
      })
    }

  return its
}

// simple yes/no type comparisons against an expectation
function check(expected, thing) {
  if (is[expected])
    return is[expected](thing)
  else
    throw new TypeError('` ' + expected + '` isn\'t a valid comparison method.')
}


function measure(expected, thing) {
  the.last.error = []

  // loop through the keys in the object to
  Object.keys(expected).forEach(function(key, value){
    if ( !is[key] )
      throw new TypeError('`' + key + '` isn\'t a valid comparison method.')
    if ( is[key](thing, expected[key]) ) {
      the.last.error.push(['See, the thing is, ', thing, ' (', typeof thing, ') isn\'t ', key, ' ', value, '.'].join(''));
    }
  })

  return !!the.last.error.length
}


module.exports = the
