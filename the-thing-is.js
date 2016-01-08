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
    error: []
  }
  return {
    is: begin
  }
}

function begin (expected) {
  var thing = the.last.thing;

  // the(thing).is()
  // expected is undefined or null -- so check mere presence of a thing
  if ( is.not.present(expected) )
    return see('present', thing)

  return goDeeper(expected, thing)
}

// will recursively see if the(thing).is(whatYouExpect)
function goDeeper (expected, thing) {

  // 'present' -- single boolean check
  // the(thing).is('integer') // true/false
  // the(thing).is('borkborkbork') // throw
  if ( is.string(expected) ) {
    return see(expected, thing)
  }

  // ['present', 'number'] -- array of boolean comparisons
  // ['present', 'number', {greaterThan:0}, {lessThanorEqualTo:100}] -- separated objects
  // ['present', 'number', {greaterThan:0, lessThanorEqualTo:100}] -- combined object
  // { foo: ['present', { bar: ['present'] }] }
  // the(thing).is(['present', 'integer'])
  if ( is.array(expected) ) {
    expected.forEach(function(expected){
      return goDeeper(expected, thing)
    })
    return !the.last.error.length
  }

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
  if ( is.plainObject(expected) ) {
    if (is.object(thing)) {

      // stash the path to branch the tree
      var pathStash = the.path.slice()

      Object.keys(expected).forEach(function expectedKeys(key, i) {
        var nexPectation, nexThing

        if (i > 0)
          the.path.pop()

        the.path.push(key)

        if (!thing.hasOwnProperty(key)) {
          return see('present', thing[key]);
        }

        nexPectation = expected[key]
        nexThing = thing[key]

        if (is.present(nexPectation)) {
          if ( is.array(nexPectation) ) {
            nexPectation.forEach(function(nexPected){
              return goDeeper(nexPected, nexThing)
            })
            return !the.last.error.length
          }
          return goDeeper(nexPectation, nexThing)
        }
      })

      the.path = pathStash.slice();
    } else {
      Object.keys(expected).forEach(function(key, i, arr){
        var standard = expected[key];
        return see(key, thing, standard);
      })
    }
  }

  return !the.last.error.length;

}


// see if the expected thing meets the standard
function see (expected, thing, standard) {

  var err = {},
      fail = {},
      failPath = the.path.join('.')

  if ( is.not.string(expected) || is.not.present(is[expected]) )
    throw new TypeError('`' + expected + '` isn\'t a valid comparison method.')

  // good to go, so go
  if ( is[expected](thing, standard) )
    return true

  // needs to be stored as an object
  if ( is.present(standard) )
    fail[expected] = standard // eg. {greaterThan:0}
  else
    fail = expected // eg. 'present'

  // needs to be stored as the value of the path
  if (the.path.length)
    err[failPath] = [fail] // eg. {'foo.bar': ['present']}
  else
    err = fail // eg. 'present'

  // need to group the fails for a key in the same array
  var isExisting = the.last.error.some(function something (last) {
    if (is.plainObject(last) && failPath in last) {
      last[failPath].push(fail)
      return true
    }
  })

  if (!isExisting)
    the.last.error.push(err)

  return false
}


module.exports = the
