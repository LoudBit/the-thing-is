# the-thing-is

Configuration Driven Validation with a cute name.

Uses [`is-it`](https://github.com/mrDarcyMurphy/is) behind the scenes for the comparisons.
  
``` javascript

var the = require('the-thing-is')

var thing = 16

// describe your object with an array to ensure the order of evaluation
var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}]

if (the(thing).is(whatYouExpect)) {
  fuckYeah()
}

if (the(thing).isnt(whatYouExpect)) {
  throwSomething(the.last.error)
}
```
