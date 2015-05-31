'use strict'

var mapObject = require('map-obj')
var JSONStream = require('jsonstream')
var es = require('event-stream')
var ObjectStream = require('objstream')

module.exports = function (server) {
  server.method('calendars.list', function listCalenders (token, next) {
    server.methods.request('get', 'users/me/calendarList', token, function (err, result) {
      if (err) return next(err)
      next(null, result
        .pipe(JSONStream.parse('items.*'))
        .pipe(es.mapSync(parseCalendar))
        .pipe(new ObjectStream())
      )
    })
  })
}

var parsers = {
  id: identity,
  title: ['summary', identity],
  color: ['backgroundColor', function (hex) {
    return hex.substr(1, hex.length)
  }],
  writable: ['accessRole', function (role) {
    return role === 'writer' || role === 'owner'
  }],
  selected: identity,
  timezone: ['timeZone', identity]

}
function parseCalendar (calendar) {
  return mapObject(parsers, function (key, value) {
    var sourceKey = key
    var transform = value
    if (Array.isArray(value)) {
      sourceKey = value[0]
      transform = value[1]
    }
    return [key, transform(calendar[sourceKey])]
  })
}

function identity (value) {
  return value
}
