'use strict'

var server = require('./')

server.listen(8080, function (err) {
  if (err) throw err
  console.log('Listening on http://localhost:8080')
})
