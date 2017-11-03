'use strict'

const express = require('express')
const router = express.Router()
const Usuario = require('../../models/Usuario')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const hashedPassword = Usuario.hashPassword(password)

  const user = Usuario.findOne({ email, password: hashedPassword })

  if (!user) {
    res.json({ ok: false, error: 'Invalid credentials' })
    return
  }

  let secret
  if (process.env.NODE_ENV === 'test') {
    secret = 'secret'
  } else {
    secret = process.env.JWT_SECRET
  }
  const token = jwt.sign({ _id: user._id }, secret)
  res.json({ ok: true, token })
})

module.exports = router
