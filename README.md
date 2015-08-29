# `the-thing-is`

> _"…now you've got errors you can work with."_

``` javascript
var the = require('the-thing-is')

var a_valid_user = {
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
    state: undefined,
    zip: 12345
  }
}

function checkUser() {
  if (the(user).is(a_valid_user)) {
    return true;
  } else {
    return the.last.error;
  }
}

checkUser(user)
```

``` javascript
// the.last.error
[
  { 'address.state': ['present'] },
  { 'address.zip': ['string'] }
]
```

`the-thing-is` uses [`is-too`](https://github.com/LoudBit/is-too) under the hood to perform the comparisons. See its README for a list of what's available.

## How to Write Validation Rules

### Array of Standards

If you've got a simple variable to check then use an array to describe what you're expecting. `the-thing-is` will run the subject through a series of standards that'll be evaluated in order.

If the variable fails to meet any of the standards, the error will be added to an array at `the.last.error`. No further tests will be run.

``` javascript
var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}]

the(16).is(whatYouExpect) // true

the(640).is(whatYouExpect) // false

the.last.thing // 640
the.last.error // [{lessThan:256}]
```

### Tree of Standards

Trees can be made as deep as you want, and `the-thing-is` will walk through it all to tell you what it finds. Should the check fail, the path to the offending nodes on the tree are stored in `the.last.error` array.

As illustrated in the first example, `checkUser(user)` returns an array of objects where the keys refer to the invalid propertiest and their values are arrays of errors.

``` javascript
// the.last.error
[
  { 'address.state': ['present'] },
  { 'address.zip': ['string'] }
]
```

In english this means `user.address.state` was `undefined`, and `user.address.zip` wasn't a string.


### Negative Standard

If you're expecting your subject to fail, then just say so.

``` javascript
var thing = undefined
the(thing).isnt('present') // true
the.last.thing // undefined
the.last.error // ['present']
```


## Errors

When your subjects fail to live up to your standards then `the-thing-is` will list _all_ of its failures.

Note:

- `the-thing-is` doesn't stop at the first error it finds. It'll describe _all_ errors for _all_ properties.
- If there are no errors, `the.last.error` will be an empty array.

``` javascript
// examples
the.last.error == []
the.last.error == ['number']
the.last.error == [{greaterThan:0}]
the.last.error == [{'foo.bar': ['number']}]
the.last.error == [{'foo.bar': ['number', {greaterThan:0}]}]
the.last.error == [{'foo.bar': ['number', {greaterThan:0}]}, {'foo.baz': ['number', {lessThan:256}]}]
```

Additionally, if you describe your object using standards that don't exist in `is-too` then `the-thing-is` will throw a TypeError.

``` javascript
the('thing').is('gonnaThrowUp')
// => TypeError("`gonnaThrowUp` isn't a valid comparison method.")
```
