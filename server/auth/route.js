'use strict'

var pick = require('lodash.pick')

module.exports = function (server) {
  server.route({
    method: ['GET', 'POST'],
    path: '/authenticate',
    config: {
      auth: 'google-oauth',
      handler: function (request, reply) {
        reply(pick(request.auth.credentials, 'token'))
      }
    }
  })
}
