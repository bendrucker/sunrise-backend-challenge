'use strict'

var route = require('./route')
var list = require('./list')

exports = module.exports = function (server, options, next) {
  route(server)
  list(server)
  next()
}
exports.attributes = {
  name: 'event'
}
