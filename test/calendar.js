'use strict'

var test = require('tape')
var nock = require('nock')
var join = require('path').join
var compose = require('../')

test('calendar', function (t) {
  var server, api, basePath
  t.test('setup', function (t) {
    compose(function (err, _server_) {
      if (err) return t.end(err)
      server = _server_
      var request = server.plugins.request
      api = nock('https://' + request.endpoint.host)
      basePath = request.endpoint.path
      t.end()
    })
  })

  t.test('list', function (t) {
    t.plan(3)
    api.get(join(basePath, 'users/me/calendarList')).reply(200, function () {
      t.equal(this.req.headers.authorization, 'Bearer theToken')
      return {
        items: [{
          id: 'bvdrucker@gmail.com',
          summary: 'Personal',
          backgroundColor: '#ff5d4f',
          accessRole: 'writer',
          selected: true,
          timeZone: 'America/New_York'
        }]
      }
    })
    server.inject({
      url: '/calendars',
      credentials: {
        token: 'theToken'
      }
    }, testResponse)
    function testResponse (response) {
      t.equal(response.statusCode, 200)
      var payload = JSON.parse(response.payload)
      t.deepEqual(payload, [{
        id: 'bvdrucker@gmail.com',
        title: 'Personal',
        color: 'ff5d4f',
        writable: true,
        selected: true,
        timezone: 'America/New_York'
      }])
    }
  })

  t.test('parser', function (t) {
    t.plan(8)
    var parse = server.plugins.calendar.parser
    function testParser (inputKey, inputValue, outputKey, outputValue, comment) {
      var target = {}
      target[inputKey] = inputValue
      t.equal(parse(target)[outputKey], outputValue, outputKey + (comment || ''))
    }
    testParser('id', 'theId', 'id', 'theId')
    testParser('summary', 'My Great Cal', 'title', 'My Great Cal')
    testParser('backgroundColor', '#ff5d4f', 'color', 'ff5d4f')
    testParser('backgroundColor', null, 'color', '', ' (null background color)')
    testParser('accessRole', 'writer', 'writable', true)
    testParser('accessRole', 'reader', 'writable', false, ' (read only)')
    testParser('selected', true, 'selected', true)
    testParser('timeZone', 'America/New_York', 'timezone', 'America/New_York')
  })

  t.test('after', function (t) {
    server.stop(t.end.bind(t))
  })

  t.end()
})
