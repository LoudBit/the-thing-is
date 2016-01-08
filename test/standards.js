/* jshint quotmark:false */
/* global describe, it */
'use strict'

var assert = require('assert')
var the = require('../the-thing-is')

describe("EXPECTATIONS AGAINST A STANDARD", function(){

  describe("the('0')", function(){

    describe(".is([{gonnaGetThrown:true}])", function(){
      it("throws an error", function(){
        var whatIExpect = [{gonnaGetThrown:true}]
        assert.throws(function(){
          the('thing').is(whatIExpect)
        }, TypeError)
      })
    })

    describe(".is([{number:'wrong'}])", function(){
      it("doesn't throw an error", function(){
        var whatIExpect = [{number:'wrong'}]
        assert.doesNotThrow(function(){
          the('0').is(whatIExpect)
        })
      })
    })

    describe(".is(['string', 'integerString', {gte: 0, lte:100}])", function() {
      it('returns true', function(){
        var whatIExpect = [
          'string', 'integerString', {
            gte: 0,
            lte: 100
          }]
        assert( the('0').is(whatIExpect) )
      })
    })

    describe(".is([{ equal:0 }])", function(){
      it('returns trur', function(){
        assert( the('0').is([{ equal: 0 }]) )
      })
    })

    describe(".is([{ exactly: '0' }])", function(){
      it("returns true", function(){
        assert( the('0').is([{ exactly: '0' }]) )
      })
    })

  })

})
