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

  t.test('events', function (t) {
    t.test('list', function (t) {
      var event = {
        id: 'evId',
        status: 'confirmed',
        summary: 'Party',
        location: 'Space',
        attendees: [
          {
            displayName: 'Ben Drucker',
            email: 'bvdrucker@gmail.com',
            self: true
          },
          {
            displayName: 'Barack Obama',
            email: 'president@whitehouse.gov'
          }
        ],
        organizer: {
          displayName: 'Ben Drucker',
          email: 'bvdrucker@gmail.com',
          self: true
        },
        start: {
          dateTime: '2015-06-01T00:00:00-04:00',
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: '2015-07-01T00:00:00-04:00',
          timeZone: 'America/New_York'
        },
        creator: {
          displayName: 'Ben Drucker',
          email: 'bvdrucker@gmail.com',
          self: true
        },
        recurrence: ['RRULE:FREQ=MONTHLY']
      }
      t.test('single page', function (t) {
        t.plan(3)
        api
          .get(join(basePath, 'calendars/123/events?maxResults=250'))
          .reply(200, function () {
            t.equal(this.req.headers.authorization, 'Bearer theToken')
            return {
              items: [event]
            }
          })
        server.inject({
          url: '/calendars/123/events',
          credentials: {
            token: 'theToken'
          }
        }, testResponse)
        function testResponse (response) {
          t.equal(response.statusCode, 200)
          var payload = JSON.parse(response.payload)
          t.deepEqual(payload, [{
            id: 'evId',
            status: 'confirmed',
            title: 'Party',
            location: 'Space',
            attendees: [
              {
                name: 'Ben Drucker',
                emails: ['bvdrucker@gmail.com'],
                self: true
              },
              {
                name: 'Barack Obama',
                emails: ['president@whitehouse.gov'],
                self: false
              }
            ],
            organizer: {
              name: 'Ben Drucker',
              emails: ['bvdrucker@gmail.com'],
              self: true
            },
            start: {
              dateTime: '2015-06-01T00:00:00-04:00',
              timezone: 'America/New_York'
            },
            end: {
              dateTime: '2015-07-01T00:00:00-04:00',
              timezone: 'America/New_York'
            },
            recurrence: 'RRULE:FREQ=MONTHLY',
            editable: true
          }])
        }
      })
      t.test('multi page', function (t) {
        t.plan(2)
        server.plugins.calendar.events.pageSize = 1
        api
          .get(join(basePath, 'calendars/123/events?maxResults=1'))
          .reply(200, function () {
            return {
              items: [event],
              nextPageToken: 'npt'
            }
          })
        api
          .get(join(basePath, 'calendars/123/events?maxResults=1&pageToken=npt'))
          .reply(200, function () {
            return {
              items: [event]
            }
          })
        server.inject({
          url: '/calendars/123/events',
          credentials: {
            token: 'theToken'
          }
        }, testResponse)
        function testResponse (response) {
          t.equal(response.statusCode, 200)
          var payload = JSON.parse(response.payload)
          t.equal(payload.length, 2, 'walks through pages')
        }
      })
    })
    t.end()
  })

  t.test('after', function (t) {
    server.stop(t.end.bind(t))
  })

  t.end()
})
