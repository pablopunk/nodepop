'use strict'

const express = require('express')
const uniqueString = require('unique-string')
const amqp = require('amqplib/callback_api')
const router = express.Router()
const Anuncio = require('../../models/Anuncio')
const { getFilter } = require('../../lib/filter')

router.get('/tags', (req, res, next) => {
  const skip = req.query.skip || 0
  const limit = req.query.limit || 0
  const shuffle = req.query.shuffle || false

  Anuncio.listTags({ shuffle, skip, limit }, (err, data) => {
    if (err) {
      next(err)
      return
    }
    res.json(data)
  })
})

router.get('/', (req, res, next) => {
  const filter = getFilter(req)
  const skip = req.query.skip || 0
  const limit = req.query.limit || 0
  const all = req.query.all && req.query.all === 'true'

  Anuncio.list({ filter, skip, limit, all }, (err, list) => {
    if (err) {
      next(err)
      return
    }
    res.json(list)
  })
})

router.get('/:id', (req, res, next) => {
  Anuncio.findOne({ _id: req.params }, (err, data) => {
    if (err) {
      next(err)
      return
    }
    res.json(data)
  })
})

router.post('/', (req, res, next) => {
  const uniqueName = uniqueString()
  const anuncio = new Anuncio(
    Object.assign(req.body, {
      foto: uniqueName
    })
  )
  const image = {
    nombre: uniqueName,
    base64: req.body.image
  }
  // añadir imagen a la cola rabbitMQ con el nombre
  amqp.connect('amqp://localhost', function (e, conn) {
    conn.createChannel(function (e, ch) {
      const q = 'nodepop_images'
      ch.assertQueue(q, { durable: true })
      ch.sendToQueue(q, Buffer.from(JSON.stringify(image)))
    })
    setTimeout(function () {
      conn.close()
    }, 500)
  })
  anuncio.save((err, data) => {
    if (err) {
      next(err)
      return
    }
    res.json(data)
  })
})

router.put('/:id', (req, res, next) => {
  Anuncio.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, data) => {
      if (err) {
        next(err)
        return
      }
      res.json(data)
    }
  )
})

router.delete('/:id', (req, res, next) => {
  Anuncio.remove({ _id: req.params.id }, err => {
    if (err) {
      next(err)
      return
    }
    res.json({})
  })
})

module.exports = router
