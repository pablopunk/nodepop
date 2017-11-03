'use strict'

const test = require('ava').serial
const request = require('supertest')
const { Mockgoose } = require('mockgoose')
const mongoose = require('mongoose')
const fixtures = require('./fixtures')

mongoose.Promise = global.Promise
const mockgoose = new Mockgoose(mongoose)

const anunciosUrl = '/apiv1/anuncios'
const authUrl = '/apiv1/authenticate'
let agent

let token

test.before(async function () {
  await mockgoose.prepareStorage()
  await mongoose.connect('mongodb://example.com/testDB', {
    useMongoClient: true
  })
  mongoose.models = {}
  mongoose.modelSchemas = {}

  agent = request.agent(require('../app'))
})

test.beforeEach(async () => {
  await fixtures.init()
})

test('Retorna un 401 para la API sin autenticar', async t => {
  const res = await agent.get(anunciosUrl)
  t.is(res.statusCode, 401)
  t.deepEqual(res.body, { ok: false, error: 'unauthorized' })
})

test('Retorna un 401 para un token invalido', async t => {
  const res = await agent.get(anunciosUrl).send({ token: 'foo-bar' })
  t.is(res.statusCode, 401)
  t.deepEqual(res.body, { ok: false, error: 'invalid token' })
})

test('Retorna un JWT', async t => {
  const res = await agent
    .post(authUrl)
    .send({ email: 'pablo@gmail.com', password: 'pass' })
  t.true(res.body.ok)
  token = res.body.token
})

test('Retorna un 200 para la API autenticada', async t => {
  const res = await agent.get(anunciosUrl).send({ token })
  t.is(res.statusCode, 200)
})

test('Retorna un JSON en utf-8', async t => {
  const res = await agent.get(anunciosUrl).send({ token })
  t.is(res.headers['content-type'], 'application/json; charset=utf-8')
})

test('Retorna una lista de anuncios', async t => {
  const res = await agent.get(anunciosUrl).send({ token })
  t.true(Array.isArray(res.body))
  t.is(res.body.length, 7)
})

test('Inserta un anuncio nuevo', async t => {
  const res = await agent
    .post(anunciosUrl)
    .send({ nombre: 'Nuevo anuncio', token })
  t.is(res.body.nombre, 'Nuevo anuncio')
})

test('Borra un anuncio', async t => {
  const res = await agent
    .post(anunciosUrl)
    .send({ nombre: 'Anuncio a borrar', token })
  await agent
    .delete(`${anunciosUrl}/${res.body._id}`)
    .send({ token })
    .then(() => t.pass())
  const { body } = await agent.get(anunciosUrl).send({ token })
  for (const anuncio of body) {
    if (anuncio.nombre === 'Anuncio a borrar') {
      t.fail()
    }
  }
  t.pass()
})

test('Lanza un error al borrar un anuncio desconocido', async t => {
  const res = await agent.delete(`${anunciosUrl}/foo`).send({ token })
  t.is(res.statusCode, 500)
})

test('Modifica un anuncio existente', async t => {
  const resPlain = await agent.get(anunciosUrl).send({ token })
  const anuncio = resPlain.body[0]
  await agent
    .put(`${anunciosUrl}/${anuncio._id}`)
    .send({ nombre: 'Modificado', token })
  const resModified = await agent.get(anunciosUrl).send({ token })
  t.is(resModified.body[0].nombre, 'Modificado')
})
