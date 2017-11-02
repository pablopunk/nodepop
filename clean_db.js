'use strict'

const mongoose = require('mongoose')
const { Anuncio, Usuario } = require('./models')
const db = require('./db.json')
require('./lib/connect_db')

// Eliminar todos los anuncios e insertar nuevos
Anuncio.remove({}, () =>
  Anuncio.insertMany(db.anuncios, () =>
    mongoose.connection.close()))

// Hash user passwords
db.users = db.users.map(u => Object.assign(u, { password: Usuario.hashPassword(u.password) }))

// Eliminar todos los usuarios e insertar nuevos
Usuario.remove({}, () =>
  Usuario.insertMany(db.users, () =>
    mongoose.connection.close()))
