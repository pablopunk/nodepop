'use strict'

const jwt = require('jsonwebtoken')

module.exports = function () {
  return function (req, res, next) {
    const token = req.body.token || req.query.token || req.get('x-access-token')

    if (!token) {
      const err = new Error('no token provided')
      next(err)
      return
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(err)
      }
      req.userId = decoded._id
      next()
    })
  }
}
