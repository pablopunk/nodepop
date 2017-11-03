'use strict'

const jwt = require('jsonwebtoken')

module.exports = function () {
  return function (req, res, next) {
    const token = req.body.token || req.query.token || req.get('x-access-token')

    if (!token) {
      res.status(401)
      res.send({ ok: false, error: 'unauthorized' })
      return
    }
    let secret
    if (process.env.NODE_ENV === 'test') {
      secret = 'secret'
    } else {
      secret = process.env.JWT_SECRET
    }
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401)
        res.send({ ok: false, error: 'invalid token' })
        return
      }
      req.userId = decoded._id
      next()
    })
  }
}
