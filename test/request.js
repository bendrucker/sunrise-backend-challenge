'use strict'

var test = require('tape')
var nock = require('nock')
var join = require('path').join
var compose = require('../')

test('request', function (t) {
  compose(function (err, server) {
    t.plan(2)
    if (err) return t.end(err)
    var plugin = server.plugins.request
    var api = nock('https://' + plugin.endpoint.host)
    var basePath = plugin.endpoint.path
    var request = server.methods.request

    api.get(join(basePath, 'foo/bar')).reply(200, function () {
      t.equal(this.req.headers.authorization, 'Bearer theToken', 'bearer header')
    })
    request('get', 'foo/bar', 'theToken', testResponse)
    function testResponse (err, response) {
      if (err) return t.end(err)
      t.ok(response.readable, 'responds with Readable')
      server.stop(t.end)
    }
  })
})
