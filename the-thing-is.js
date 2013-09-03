// The Thing Is
// Configuration driven validation
// with the goal of a near-readable-english syntax

// Usage:
//
// var whatYouExpect = 'number' // string (least useful)
// var whatYouExpect = ['present', 'number', {greaterThan:0}] // array (tightest to write)
// var whatYouExpect = {present:true, number:true, greaterThan:0} // object (verbose)
//
// call a callback when done
// the(thing).isnt(whatYouExpect).then(function(){ throw Error('NOOOOOOOOOO!') })
// the(thing).isnt(whatYouExpect).then(throwSomething)
//
// optionally chain callback logic
// the(thing).isnt(whatYouExpect).do(throwSomething).else(drinkUp)
// the(thing).is(whatYouExpect).do(someThing).else(doSomethingElse)
//
// tell the function what to return to avoid the primitive v. object challenge
// return, do, then could be alias' of each other
// they'd check typeof argument and run the function, or return the value, or return true/false based on the whether or not the check failed
// if (the(thing).isnt(whatYouExpect)) // automatically returns false because you passed in an array or object
// if (the(thing).isnt(whatYouExpect).return(false))
// if (the(thing).isnt(whatYouExpect).do(false))
// if (the(thing).isnt(whatYouExpect).then(false))
// if (the(thing).isnt(whatYouExpect).then(callback)) // doesn't make sense in an if check
// if (the(thing).isnt(whatYouExpect).then())
// if (the(thing).is(whatYouExpect).then() )
// if (the(thing).is.present().number().gt(5).then())
// the(thing).isnt(whatYouExpect).then(callback)

// Don't do this
// it will always be true because it returns an object
//
// if (the(thing).is.present().number())

// potential alias
// ifThe(thing).is.present().number().greaterThan(5).do(callback)


// if (the(thing).is(['number', {greaterThan:0}])) {
//   // celebrate
// }
// if (the(thing).isnt(['number', {greaterThan:0}])) {
//   throw the.last.error
// }

// Dependencies
var is = require('is-it')
var method


function the (subject) {
  the.past.push({ subject:subject })
  the.last = the.past[the.past.length-1 || 0]
  return comparisons
}

the.past = []
the.last = null

// is, isnt, is.not
var comparisons = {
  is: {},
  isnt: {}
}

function isProxy(config) {
  // return function() {
  //   var args = Array.prototype.slice.call(arguments)
  //   args.unshift(the.last.subject)
  //   if ( !the.last.error && is.not[method].apply(this, args) ) {
  //     the.error(method)
  //   }
  // }
}

// function isntProxy(method) {
//   return function() {
//     var args = Array.prototype.slice.call(arguments)
//     args.unshift(the.last.subject)
//     if (!the.last.error && is[method].apply(this, args)) {
//       the.error(method)
//     }
//     return comparisonOperators.isnt
//   }
// }


for (method in is) {
  if (is.hasOwnProperty(method) && typeof is[method] == 'function') {
    // create the(thing).is.whatever()
    the.is[method] = (isProxy)(method)
    the.isnt[method] = (isntProxy)(method)
  }
}

module.exports = the
