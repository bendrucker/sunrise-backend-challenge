'use strict'

var test = require('tape')
var parse = require('./')
var event = require('../fixture.json')

test('event parser', function (t) {
  t.deepEqual(parse(event), {
    id: '_dh1l2i2d6l466u3681mmapbk5ppnarjid5pmabj1dk',
    status: 'confirmed',
    title: 'Ben / Pierre',
    start: {
      dateTime: '2015-05-29T11:00:00-04:00',
      timezone: 'America/New_York'
    },
    end: {
      dateTime: '2015-05-29T11:30:00-04:00',
      timezone: 'America/New_York'
    },
    attendees: [{
      name: 'Pierre Valade',
      emails: ['pival@microsoft.com'],
      self: false,
      rsvpStatus: 'accepted'
    }],
    organizer: {
      name: 'Ben Drucker',
      emails: ['bvdrucker@gmail.com'],
      self: true
    },
    editable: true,
    // these need to be explicitly undefined for deep equality
    // they'll be filtered out via JSON.stringify
    location: undefined,
    recurrence: undefined
  })
  t.doesNotThrow(parse.bind(null, {}))
  t.end()
})
