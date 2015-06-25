> _"You see, the thing is..."_

...now you've got a simple tool for complex validations. It's like [Joi](https://github.com/hapijs/joi) for the browser.

`the-thing-is` uses [`is-too`](https://github.com/LoudBit/is-too) for the comparisons. See its README for a list of what's available.


### Array of Standards

When you've got a sole variable that needs to be within certain bounds then use an array to describe it with a series of properties that'll be evaluated in order.

``` javascript
var whatYouExpect = ['present', 'integer', {greaterThan:0, lessThan:256}]

the(16).is(whatYouExpect) // true
the(640).is(whatYouExpect) // false

// Recap
the.last.thing // 640
the.last.error // [{lessThan:256}]
```


### Tree of Standards

This is where the true value of `the-thing-is` is. Trees can be as deep as you want, and `the-thing-is` walks through it to check each node.
Should the check fail, it'll record the path to the offending node on the tree and store it in `the.last.error`.

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
the.last.thing // undefined
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


