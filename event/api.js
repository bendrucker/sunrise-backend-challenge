'use strict'

var printf = require('pff')
var client = require('../client')
var parse = require('./parser')

exports.list = function (calendarId, token, callback) {
  var path = printf('calendars/%s/events', calendarId)
  var events = []
  function walk (page) {
    if (typeof page === 'function') {
      next = page
      page = undefined
    }

    var options = {token: token}
    if (page) options.query = {pageToken: page}

    client.request(path, options, function (err, data) {
      if (err) return callback(err)
      events.push.apply(events, data.items.map(parse))
      if (data.nextPageToken) return walk(data.nextPageToken)
      callback(null, events)
    })
  }

  walk()
}
