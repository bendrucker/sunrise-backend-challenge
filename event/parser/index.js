'use strict'

var obstruct = require('obstruction')
var person = require('./person')

module.exports = obstruct({
  id: true,
  status: true,
  title: 'summary',
  start: obstruct.optional({
    dateTime: true,
    timezone: 'timeZone'
  }),
  end: obstruct.optional({
    dateTime: true,
    timezone: 'timeZone'
  }),
  location: true,
  attendees: obstruct.optional(obstruct.array(person.attendee)),
  organizer: obstruct.optional(person.organizer),
  editable: ['creator.self', Boolean],
  recurrence: '0'
})
