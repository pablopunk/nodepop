'use strict'

const mongoose = require('mongoose')
const auth = require('../auth.json')

mongoose.Promise = global.Promise
const conn = mongoose.connection

conn.on('error', err => {
  throw new Error(err)
})
conn.on('open', () => console.log(`Connected to mongoose: ${conn.name}`))

mongoose.connect(
  `mongodb://${auth.db_user}:${auth.db_pass}@${auth.db_host}/${auth.db_name}`,
  { useMongoClient: true }
)
