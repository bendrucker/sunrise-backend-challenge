'use strict'

var obstruct = require('obstruction')
var extend = require('xtend')

// extend from a single base to create multiple person schemas
var base = {
  name: 'displayName',
  emails: ['email', function (email) {
    return [email]
  }],
  self: Boolean
}

exports.organizer = obstruct(base)

exports.attendee = obstruct(extend(base, {
  rsvpStatus: 'responseStatus'
}))
