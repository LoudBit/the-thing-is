# the-thing-is

Detailed Object Descriptions.

Uses [`is-too`](https://github.com/LoudBit/is-too) behind the scenes for the comparisons.

``` javascript

var the = require('the-thing-is')

var thing = 16

// describe your object with an array to ensure the order of evaluation
var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}]

if (the(thing).is(whatYouExpect)) {
  ohYeah()
}

if (the(thing).isnt(whatYouExpect)) {
  throw the.last.error
}
```

You can check more complex objects by writing a dictionary of nested descriptions:

``` javascript
var thing = {
  foo: {
    bar: "baz"
  },
  fizz: "buzz",
  metal: 666
}

// describe your object with an array to ensure the order of evaluation
var whatYouExpect = {
  foo: {
    bar: 'string'
  },
  fizz: 'string',
  metal: ['number', {greaterThan:665}, {lessThan:667}]
}

if (the(thing).is(whatYouExpect)) {
  rockOn()
}
```
