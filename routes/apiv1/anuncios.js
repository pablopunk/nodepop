'use strict'

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const shuffle = require('array-shuffle')
const Anuncio = require('../../models/Anuncio')

const getFilter = req => {
  const nombre = req.query.nombre ? { nombre: new RegExp(`^${req.query.nombre}`, 'i') } : {}
  const tags = req.query.tags
    ? { tags: { $in: req.query.tags.split(',') } }
    : {}
  const venta = req.query.venta ? { venta: req.query.venta === 'true' } : {}
  const precioMin = req.query.precioMin ? { $gte: req.query.precioMin } : null
  const precioMax = req.query.precioMax ? { $lte: req.query.precioMax } : null
  const precio = (precioMin || precioMax) ? { precio: Object.assign({}, precioMin, precioMax) } : null
  return Object.assign({}, nombre, tags, venta, precio)
}

router.get('/tags', (req, res, next) => {
  const skip = req.query.skip || 0
  const limit = req.query.limit || 0
  const shuffle = req.query.shuffle || false
  const count = req.query.count ? req.query.count === 'true' : false
  Anuncio.listTags({ shuffle, skip, limit, count }, (err, data) => {
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
  const count = req.query.count && req.query.count === 'true'

  Anuncio.list({ filter, skip, limit, count }, (err, list) => {
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
  const anuncio = new Anuncio(req.body)
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
