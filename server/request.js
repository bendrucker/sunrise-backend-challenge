'use strict'

var wreck = require('wreck')
var url = require('url')
var apiBase = 'https://www.googleapis.com/calendar/v3/'

exports = module.exports = function (server, options, next) {
  server.method('request', request)
  var parsed = url.parse(apiBase)
  server.expose('endpoint', {
    host: parsed.host,
    path: parsed.path,
    url: apiBase
  })
  next()
}
exports.attributes = {
  name: 'request'
}

function request (method, path, token, next) {
  var uri = url.resolve(apiBase, path)
  var headers = {Authorization: 'Bearer ' + token}
  wreck.request(method, uri, {headers: headers}, next)
}
