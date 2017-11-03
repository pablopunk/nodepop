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

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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
