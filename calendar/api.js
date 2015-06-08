'use strict'

var client = require('../client')
var parser = require('./parser')

exports.list = function (token, callback) {
  var path = 'users/me/calendarList'
  client.request(path, {token: token}, function (err, data) {
    if (err) return callback(err)
    callback(null, data.items.map(parser))
  })
}
