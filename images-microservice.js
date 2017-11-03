'use strict'

// microservicio que gestiona
// las imagenes de una cola rabbitmq

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
          console.log(msg)
          ch.ack(msg)
        }
      })
    })
  })
