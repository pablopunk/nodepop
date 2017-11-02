'use strict'

const mongoose = require('mongoose')
const hash = require('hash.js')

const usuarioSchema = mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String
})

usuarioSchema.statics.hashPassword = plain => hash.sha256().update(plain).digest('hex')
const Usuario = mongoose.model('Usuario', usuarioSchema)

module.exports = Usuario
