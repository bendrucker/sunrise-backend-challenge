'use strict'

var test = require('tape')
var nock = require('nock')
var client = require('./client')

test('api client', function (t) {
  var api = nock(client.api.protocol + '://' + client.api.host)
  t.test('requires token', function (t) {
    t.plan(2)
    client.request('path', {}, function (err) {
      t.ok(err)
      t.equal(err.message, 'token is required')
    })
  })
  t.test('request', function (t) {
    t.plan(2)
    api
      .get(client.api.pathname + 'path')
      .reply(200, function () {
        t.equal(this.req.headers.authorization, 'Bearer theToken')
        return {foo: 'bar'}
      })

    client.request('path', {token: 'theToken'}, function (err, data) {
      if (err) return t.end(err)
      t.deepEqual(data, {
        foo: 'bar'
      })
    })
  })
  t.test(function (t) {
    nock.cleanAll()
    t.end()
  })
  t.end()
})
