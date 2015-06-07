'use strict'

var obstruct = require('obstruction')
var person = require('./person')

module.exports = obstruct({
  id: true,
  status: true,
  title: 'summary',
  start: {
    dateTime: true,
    timezone: 'timeZone'
  },
  end: {
    dateTime: true,
    timezone: 'timeZone'
  },
  location: true,
  attendees: obstruct.array(person.attendee),
  organizer: person.organizer,
  editable: ['creator.self', Boolean],
  recurrence: '0'
})
