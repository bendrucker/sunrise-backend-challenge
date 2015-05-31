'use strict'

var wreck = require('wreck')
var url = require('url')
var apiBase = 'https://www.googleapis.com/calendar/v3/'

exports = module.exports = function (server, options, next) {
  server.method('request', request)
  next()
}
exports.attributes = {
  name: 'request'
}

function request (method, path, token, next) {
  var uri = url.resolve(apiBase, path)
  var headers = {Authorization: 'Bearer ' + token}
  wreck.request(method, uri, {headers: headers, json: true}, next)
}
