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
function the (thing) {
  the.last = {
    thing: thing,
    outcome: {}
  }
  return {
    is: what,
    isnt: function (expected, thing) {
      return !this.is(expected, thing)
    }
  }
}

// GOAL: `see` and `what` are the only methods
// GOAL: able to create a valid outcome mapping along the way

// will recursively compare the thing against the provided description
function what (expected, thing) {

  thing = thing || the.last.thing

  // the(thing).is()
  // expected is undefined or null -- so check mere presence of a thing
  if ( is.not.present(expected) )
    return see('present', thing)

  // 'present' -- single boolean check
  // the(thing).is('integer') // true/false
  // the(thing).is('borkborkbork') // throw
  if ( is.string(expected) )
    return see(expected, thing)


  // ['present', 'number'] -- array of boolean comparisons
  // ['present', 'number', {greaterThan:0}, {lessThanorEqualTo:100}] -- separated objects
  // ['present', 'number', {greaterThan:0, lessThanorEqualTo:100}] -- combined object
  // { foo: ['present', { bar: ['present'] }] }
  // the(thing).is(['present', 'integer'])
  if ( is.array(expected) )
    return expected.every(function(expected){
      return what(expected, thing)
    })

  // { foo: ['bar'] } -- dictionary describing complex or deep objects
  // the(thing).is({
  //   name: ['present', 'string'],
  //   address: {
  //     street: 'string',
  //     city: 'string',
  //     state: 'string',
  //     zip: 'string'
  //   }
  // })
  if ( is.plainObject(expected) )
    if (is.plainObject(thing))
      return Object.keys(expected).every(function(key, i, arr){
        var nexThing = thing[key]
        var nexPectation = expected[key]
        if ( is.present(nexPectation) && is.present(nexThing) )
          return what(nexPectation, nexThing)
      })
    else
      return Object.keys(expected).every(function(key, i, arr){
        var standard = expected[key];
        return see(key, thing, standard);
      })

  return false;

}

// simple yes/no type comparisons against an expectation
function see (expected, thing, standard) {
  if ( is.not.string(expected) || is.not.present(is[expected]) )
    throw new TypeError('`' + expected + '` isn\'t a valid comparison method.')
  else
    return is[expected](thing, standard)
}


module.exports = the
