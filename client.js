'use strict'

var url = require('url')
var extend = require('xtend')
var got = require('got')

var api = {
  protocol: 'https',
  host: 'www.googleapis.com',
  pathname: '/calendar/v3/'
}

var baseUrl = url.format(api)

exports.request = function apiRequest (path, options, callback) {
  options = extend({json: true}, options)
  if (!options.token) {
    return callback(new Error('token is required'))
  }
  headers(options)

  // strip leading slash so the base path isn't clobbered
  var uri = url.resolve(baseUrl, path.replace(/^\/'/, ''))

  got(uri, options, callback)
}

exports.api = api

function headers (options) {
  var headers = options.headers = options.headers || {}
  headers.authorization = 'Bearer ' + options.token
}
