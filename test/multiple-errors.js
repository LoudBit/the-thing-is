/* jshint quotmark:false */
/* global describe, it, before */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe('THINGS WITH MULTIPLE ERRORS', function() {

  describe("the('thing')", function() {
    describe(".is(['number', {greaterThan:0}, {lessThan:1000}])", function() {
      before(function(){
        the('thing').is(['number', {greaterThan:0}, {lessThan:1000}])
      })
      it("reports thing isn't a number", function(){
        assert.equal( the.last.error[0], 'number')
      })
      it("reports thing isn't greaterThan:0", function(){
        assert.deepEqual( the.last.error[1], {greaterThan:0})
      })
      it("reports thing isn't lessThan:1000", function(){
        assert.deepEqual( the.last.error[2], {lessThan:1000})
      })
    })
  })

  describe("the({ foo: 1, bar: 2, fizz: { buzz: 'fizzbuzz' }})", function(){
    describe(".is({ foo: ['number'], bar: ['string'], fizz: { buzz: ['number', {greaterThan:0}] } })", function() {
      before(function(){
        the({
          foo: 1,
          bar: 2,
          fizz: {
            buzz: 'fizzbuzz'
          }
        }).is({
          foo: ['number'],
          bar: ['string'],
          fizz: {
            buzz: ['number', {greaterThan:0}]
          }
        })
        console.log('\nthe.last.error: ', the.last.error, '\n');
      })
      it("reports `bar` isn't a string", function(){
        assert.deepEqual( the.last.error[0], {bar:['string']})
      })
      it("reports `fizz.buzz` has errors", function(){
        assert.deepEqual(the.last.error[1], {
          'fizz.buzz': [
            'number',
            { greaterThan:0 }
          ]
        })
      })
      it("reports `fizz.buzz` has isn't a number", function(){
        assert.deepEqual(the.last.error[1]['fizz.buzz'][0], 'number')
      })
      it("reports `fizz.buzz` has isn't greaterThan:0", function(){
        assert.deepEqual(the.last.error[1]['fizz.buzz'][1], {greaterThan:0})
      })
    })
  })
})
