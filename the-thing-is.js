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
  the.path = []
  the.last = {
    thing: thing,
    wasnt: []
  }
  return {
    is: what,
    isnt: function (expected, thing) {
      return !this.is(expected, thing)
    }
  }
}


// will recursively see if the(thing).is(whatYouExpect)
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
    if (is.plainObject(thing)) {

      // stash the path to branch the tree
      var pathStash = the.path.slice()

      var result = Object.keys(expected).every(function(key, i){
        var nexThing = thing[key]
        var nexPectation = expected[key]

        if (i > 0)
          the.path.pop()

        the.path.push(key)

        if ( is.present(nexPectation) && is.present(nexThing) )
          return what(nexPectation, nexThing)
        else
          return see('present', nexThing)
      })

      the.path = pathStash.slice();
      return result
    }
    else
      return Object.keys(expected).every(function(key, i, arr){
        var standard = expected[key];
        return see(key, thing, standard);
      })

  return false;

}


function see (expected, thing, standard) {
  var wasnt = {}
  var err = {}

  if ( is.not.string(expected) || is.not.present(is[expected]) )
    throw new TypeError('`' + expected + '` isn\'t a valid comparison method.')

  if ( is[expected](thing, standard) )
    return true

  if ( is.present(standard) )
    err[expected] = standard
  else
    err = expected

  if (the.path.length)
    wasnt[the.path.join('.')] = err
  else
    wasnt = err

  the.last.wasnt.push(wasnt)

  return false
}


module.exports = the
