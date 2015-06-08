'use strict'

var test = require('tape')
var parse = require('./parser')
var calendar = require('./fixture.json')

test('calendar parser', function (t) {
  t.deepEqual(parse(calendar), {
    id: 'bvdrucker@gmail.com',
    title: 'Personal',
    color: 'f83a22',
    writable: true,
    selected: true,
    timezone: 'America/New_York'
  })
  t.notOk(parse({accessRole: 'reader'}).writable)
  t.end()
})
