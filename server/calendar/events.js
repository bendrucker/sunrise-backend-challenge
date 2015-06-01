'use strict'

var format = require('util').format
var Readable = require('readable-stream')
var PassThrough = Readable.PassThrough
var JSONStream = require('jsonstream')
var qs = require('qs')
var extend = require('xtend')
var es = require('event-stream')
var mapObject = require('map-obj')

module.exports = function (server) {
  var config = {
    pageSize: 250
  }
  server.expose('events', config)
  server.method('events.list', function listEvents (calendarId, token, next) {
    var events = new EventStream({
      calendar: calendarId,
      token: token,
      pageSize: config.pageSize
    })
    next(null, events
      .pipe(es.mapSync(parseEvent))
      .pipe(JSONStream.stringify())
      .pipe(PassThrough()))
  })

  function EventStream (options) {
    options = options || {}
    options.objectMode = true
    Readable.call(this, options)
    this.pageSize = options.pageSize
    this.calendar = options.calendar
    this.token = options.token
  }
  EventStream.prototype = Object.create(Readable.prototype)
  EventStream.prototype._buffered = 0
  EventStream.prototype._requested = 0
  EventStream.prototype._read = function () {
    this.load()
    this._reading = true
  }
  EventStream.prototype.load = function () {
    if (this._reading) return
    this._getPage()
  }
  EventStream.prototype._getPage = function (pageToken) {
    var self = this
    var path = format('calendars/%s/events?%s', this.calendar, qs.stringify({
      maxResults: this.pageSize,
      pageToken: pageToken
    }))
    server.methods.request('get', path, this.token, function (err, result) {
      if (err) return self.emit('error', err)
      result
        .pipe(JSONStream.parse())
        .on('data', function (data) {
          data.items.map(function (event) {
            self.push(event)
          })
          var nextPage = data.nextPageToken
          if (nextPage) return self._getPage(nextPage)
          self.push(null)
        })
    })
  }
}
function parsePerson (person) {
  return {
    name: person.displayName,
    emails: [person.email],
    self: !!person.self
  }
}
var parsers = {
  id: identity,
  status: identity,
  title: ['summary', identity],
  location: identity,
  attendees: function (attendees) {
    return attendees.map(function (person) {
      return extend(parsePerson(person), {
        rsvpStatus: person.responseStatus
      })
    })
  },
  organizer: parsePerson
}
function parseEvent (event) {
  var parsed = mapObject(parsers, function (key, value) {
    var sourceKey = key
    var transform = value
    if (Array.isArray(value)) {
      sourceKey = value[0]
      transform = value[1]
    }
    return [key, transform(event[sourceKey])]
  })
  parsed.start = {
    dateTime: event.start.dateTime,
    timezone: event.start.timeZone
  }
  parsed.end = {
    dateTime: event.end.dateTime,
    timezone: event.end.timeZone
  }
  parsed.editable = !!event.creator.self
  parsed.recurrence = Array.isArray(event.recurrence) ? event.recurrence[0] : ''
  return parsed
}

function identity (value) {
  return value
}

