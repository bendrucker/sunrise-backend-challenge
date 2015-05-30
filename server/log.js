'use strict'

var good = require('good')
var console = require('good-console')

exports = module.exports = function (server, options, next) {
  server.register({
    register: good,
    options: {
      reporters: [{
        reporter: console,
        events: {log: '*', error: '*', response: '*'}
      }]
    }
  }, next)
}
exports.attributes = {
  name: 'log'
}
