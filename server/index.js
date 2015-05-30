'use strict'

var compose = require('glue').compose

module.exports = function (callback) {
  var manifest = {
    server: {},
    connections: [{port: 8080}],
    plugins: {
      './auth': {},
      './log': {},
      './request': {},
      './calendar': [{
        routes: {
          prefix: '/calendars'
        }
      }]
    }
  }
  var options = {
    relativeTo: __dirname
  }
  compose(manifest, options, callback)
}

