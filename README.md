# the-thing-is

> _"You see, the thing is..."_

...now you can thoroughly and precisely measure your subjects against a series of standards.

`the('16').is(['present', 'numberString', {greaterThanOrEqualTo:0}]) // true`

This thing is _great_ for front-end form validation.

[`is-too`](https://github.com/LoudBit/is-too) does comparisons behind the scenes. `the-thing-is` handles the organization of multiple checks. See `is-too`'s README for a list of what's available.


## Basic usage

``` javascript
var the = require('the-thing-is')

the('thing').is('present') // true
```

### Array of Standards

Use an array to describe your subject with a series of attributes that will be evaluated in order.

``` javascript
var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}]

the(16).is(whatYouExpect) // true
the(640).is(whatYouExpect) // false
```

### Tree of Standards

This is where the true value of `the-thing-is` is. Trees can be as deep as you want, `the-thing-is` works through it recursively.
Should the check fail, it'll record the path to the offending branch of the tree and store it as an error.

``` javascript
var userSchema = {
  name: ['string'],
  address: {
    street1: ['present', 'string', {matches: /.*/}],
    street2: ['string'],
    city: ['present', 'string'],
    state: ['present', 'string', {matches: /^[A-Z]{2}$/}],
    zip: ['present', 'string', {matches: /^[0-9]{5}$/}]
  }
}

var user = {
  name: "Joe Bob",
  address: {
    street1: '123 Any St.',
    street2: '',
    city: 'Anytown',
    state: 'NE',
    zip: 12345
  }
}

the(user).is(userSchema) // false
the.last.error // [{ 'address.zip': ['string'] }]
```


### Negative Standard

If your subject is like an unruly teenager and you expect it to fail to live up to your standards all the time, then just say so.

``` javascript
var teenager = undefined
the(teenager).isnt('present') // true
the.last.error // ['present']
```


## Errors

If your subject fails to live up to the standard you've set then `the-thing-is` will dutifully list all the ways it does so, in a way intended to be useful enough for you to deliver a useful message to your users.

- Failed simple checks will return a string.
- Failed objects will return an object with a key referring to the branch in the tree, and an array of failures.

Altogether, `the-thing-is` will return an array of all your subject's failures.


``` javascript
the.last.error == ['number']
the.last.error == [{greaterThan:0}]
the.last.error == [{'foo.bar': ['number']}]
the.last.error == [{'foo.bar': ['number', {greaterThan:0}]}]
```

Additionally, if you describe your object using standards that don't exist in `is-too` then `the-thing-is` will throw a TypeError.

``` javascript
the('thing').is('gonnaThrowUp')
// => TypeError("`gonnaThrowUp` isn't a valid comparison method.")
```


