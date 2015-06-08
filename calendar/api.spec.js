'use strict'

var test = require('tape')
var nock = require('nock')
var calendars = require('./api')
var client = require('../client')
var parse = require('./parser')
var fixture = require('./fixture.json')

test('calendar api', function (t) {
  t.plan(3)
  var api = nock(client.api.protocol + '://' + client.api.host)
  api
    .get(client.api.pathname + 'users/me/calendarList')
    .reply(200, function () {
      t.equal(this.req.headers.authorization, 'Bearer theToken')
      return {
        items: [fixture]
      }
    })
  calendars.list('theToken', function (err, data) {
    if (err) return t.end(err)
    t.equal(data.length, 1)
    t.deepEqual(data, [parse(fixture)])
  })
  nock.cleanAll()
})
