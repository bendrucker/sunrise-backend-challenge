'use strict'

var bootstrap = require('./')

bootstrap(function (err, server) {
  if (err) throw err
  server.start()
})
