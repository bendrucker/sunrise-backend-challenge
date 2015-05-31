'use strict'

var routes = require('./routes')
var listCalendars = require('./list')

exports = module.exports = function (server, options, next) {
  routes(server)
  listCalendars(server)
  next()
}
exports.attributes = {
  name: 'calendar'
}
