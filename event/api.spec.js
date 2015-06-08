'use strict'

var test = require('tape')
var nock = require('nock')
var events = require('./api')
var client = require('../client')
var parse = require('./parser')
var fixture = require('./fixture.json')

test('events api', function (t) {
  t.plan(4)
  var api = nock(client.api.protocol + '://' + client.api.host)
  var path = client.api.pathname + 'calendars/bvdrucker@gmail.com/events'

  // return a page token with the first response
  api
    .get(path)
    .reply(200, function () {
      t.equal(this.req.headers.authorization, 'Bearer theToken')
      return {
        nextPageToken: 'thePageToken',
        items: [fixture]
      }
    })
  // no token with the second (we're done)
  api
    .get(path + '?pageToken=thePageToken')
    .reply(200, function () {
      t.equal(this.req.headers.authorization, 'Bearer theToken')
      return {
        items: [fixture]
      }
    })

  events.list('bvdrucker@gmail.com', 'theToken', function (err, data) {
    if (err) return t.end(err)
    t.equal(data.length, 2)
    t.deepEqual(data[0], parse(fixture))
    nock.cleanAll()
  })
})
