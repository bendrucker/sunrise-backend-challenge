'use strict'

var pick = require('lodash.pick')

module.exports = function (server) {
  server.route({
    method: ['GET', 'POST'],
    path: '/authenticate',
    config: {
      auth: 'google',
      handler: function (request, reply) {
        reply(pick(request.auth.credentials, 'token'))
      }
    }
  })
}
