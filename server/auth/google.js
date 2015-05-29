'use strict'

module.exports = function (server) {
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: '',
    clientId: '',
    clientSecret: ''
  })
}
