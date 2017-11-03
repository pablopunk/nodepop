'use strict'

const jimp = require('jimp')

const imagesFolder = 'public/images/anuncios'

const removeBase64 = img => img.replace(/^data:image\/[a-z]+;base64,/, '')
const getExtension = img => img.indexOf('png') >= 0 ? 'png' : 'jpg'

require('amqplib/callback_api')
  .connect('amqp://localhost', (err, conn) => {
    if (err) {
      throw err
    }
    conn.createChannel((err, ch) => {
      if (err) {
        throw err
      }
      const q = 'nodepop_images'
      ch.assertQueue(q)
      ch.consume(q, msg => {
        if (msg) {
          const image = JSON.parse(msg.content.toString('utf-8'))
          console.log(`Transfomando imagen ${image.nombre}`)
          const ext = getExtension(image.base64)
          image.base64 = removeBase64(image.base64)
          jimp.read(Buffer.from(image.base64, 'base64')).then(i => {
            i
              .resize(100, 100)
              .write(`${imagesFolder}/${image.nombre}-thumbnail.${ext}`)
          })
          ch.ack(msg)
        }
      })
    })
  })
