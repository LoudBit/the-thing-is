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
  console.log('*');
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

  console.log('\nbegin() ==========');
  console.log('  expected    :', expected);
  console.log('  thing       :', thing);

  // the(thing).is()
  // expected is undefined or null -- so check mere presence of a thing
  if ( is.not.present(expected) )
    return see('present', thing)

  return goDeeper(expected, thing)
}

// will recursively see if the(thing).is(whatYouExpect)
function goDeeper (expected, thing) {

  console.log('\ngoDeeper()', expected, thing);

  // 'present' -- single boolean check
  // the(thing).is('integer') // true/false
  // the(thing).is('borkborkbork') // throw
  if ( is.string(expected) ) {
    console.log(' - expected is a string');
    return see(expected, thing)
  }

  // ['present', 'number'] -- array of boolean comparisons
  // ['present', 'number', {greaterThan:0}, {lessThanorEqualTo:100}] -- separated objects
  // ['present', 'number', {greaterThan:0, lessThanorEqualTo:100}] -- combined object
  // { foo: ['present', { bar: ['present'] }] }
  // the(thing).is(['present', 'integer'])
  if ( is.array(expected) ) {
    console.log(' - expected is an array')
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
  // if (is.plainObject(expected)) {
  //   console.log(' - expected is a plain object')
  //   if (is.undef(thing)) {
  //     console.log('step 3a1 - thing is undefined')
  //     console.log('     3a1 - expected: ', expected);
  //     return see(expected, thing)
  //   }
  //   if (is.object(thing)) {
  //
  //     console.log('step 3b - thing is an object')
  //
  //     // stash the path to branch the tree
  //     var pathStash = the.path.slice()
  //
  //     Object.keys(expected).forEach(function expectedKeys(key, i) {
  //       console.log('step 4c')
  //       var nexPectation, nexThing
  //
  //       if (i > 0)
  //         the.path.pop()
  //
  //       the.path.push(key)
  //
  //       console.log('key?', key);
  //       console.log('thing.hasOwnProperty(key)', thing.hasOwnProperty(key));
  //       console.log('!thing.hasOwnProperty(key)', !thing.hasOwnProperty(key));
  //       console.log('is.undef(thing[key])     ', is.undef(thing[key]));
  //       if (!thing.hasOwnProperty(key) || is.undef(thing[key])) {
  //         console.log('*** short circuiting');
  //         // return see('present', thing[key]);
  //         return see(expected[key], thing[key])
  //       }
  //       // else {
  //       //
  //       // }
  //
  //       nexPectation = expected[key]
  //       nexThing = thing[key]
  //
  //       console.log('nexPectation  :', nexPectation);
  //       console.log('nexThing      :', nexThing);
  //
  //       if ( is.present(nexPectation) ) {
  //         console.log('a');
  //         if ( is.plainObject(nexPectation) || is.array(nexPectation) ) {
  //           console.log('b');
  //           return goDeeper(nexPectation, nexThing)
  //         } else {
  //           console.log('c');
  //           see(nexPectation, nexThing)
  //         }
  //       }
  //       else {
  //         console.log('d');
  //         return see(nexPectation, nexThing)
  //       }
  //
  //       // if ( is.present(nexPectation) && is.present(nexThing) )
  //       //   return goDeeper(nexPectation, nexThing)
  //       // else
  //       //   if ( is.present(nexPectation) && is.not.present(nexThing) )
  //       //     return goDeeper(nexPectation, nexThing)
  //       //   else
  //       //     return see(nexPectation, nexThing)
  //     })
  //     the.path = pathStash.slice();
  //   }
  //   else {
  //     console.log('step 3c - thing is not an object')
  //     Object.keys(expected).forEach(function(key, i, arr){
  //       console.log('  key         :', key);
  //       var standard = expected[key];
  //       return see(key, thing, standard);
  //     })
  //   }
  // }

  if ( is.plainObject(expected) ) {
    console.log(' - expected is a plain object')
    if (is.object(thing)) {
      console.log(' - thing is a plain object')

      // stash the path to branch the tree
      var pathStash = the.path.slice()

      Object.keys(expected).forEach(function expectedKeys(key, i) {
        console.log(' - key: ' + key);
        var nexPectation, nexThing

        if (i > 0)
          the.path.pop()

        the.path.push(key)

        if (!thing.hasOwnProperty(key)) {
          console.log('!thing.hasOwnProperty(key)', key);
          return see('present', thing[key]);
        }

        nexPectation = expected[key]
        nexThing = thing[key]

        console.log(' - nexPectation: ', nexPectation);
        console.log(' - nexThing: ', nexThing);

        if (is.present(nexPectation)) {
          console.log(' - nexPectation is present');
          if ( is.array(nexPectation) ) {
            console.log(' - nexPectation is an array')
            nexPectation.forEach(function(nexPected){
              return goDeeper(nexPected, nexThing)
            })
            return !the.last.error.length
          }
          console.log(' ++++++ ');
          return goDeeper(nexPectation, nexThing)
        }
        // if ( is.present(nexPectation) && is.present(nexThing) )
        //   return what(nexPectation, nexThing)
        // else
        //   return see(nexPectation, nexThing)
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

  console.log('\nsee ==========:')
  console.log('  expected    :', expected);
  console.log('  thing       :', thing);
  console.log('  standard    :', standard);


  var err = {},
      fail = {},
      failPath = the.path.join('.')

  console.log('is.' + expected, !!is[expected]);

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
