'use strict'

module.exports = function (req, res, next) {
  var token = req.query.accessToken
  if (!token) {
    return res.status(401).json({
      error: 'accessToken param missing'
    })
  } else {
    res.locals.token = token
    next()
  }
}
