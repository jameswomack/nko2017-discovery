require('dotenv').load()
const fs = require('fs')
const express = require('express')
const app = express()
const client = require('redis').createClient(process.env.REDIS_URL)
const path = require('path')

const apiKeySid = process.env.TWILIO_API_KEY
const apiKeySecret = process.env.TWILIO_API_SECRET
const accountSid = process.env.TWILIO_ACCOUNT_SID
const Twilio = require('twilio')
const twilio = new Twilio(apiKeySid, apiKeySecret, {accountSid: accountSid});

app.get('/badge/:user', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml')
  client.hgetall(req.params.user, (err, user) => {
    if (err) return res.sendFile(path.resolve('./images/red.svg'))
    if (!user.room) return res.sendFile(path.resolve('./images/red.svg'))

    twilio.video.rooms(user.room).fetch().then(room => {
      console.info(room)
      return res.sendFile(path.resolve('./images/green.svg'))
    }).catch(err => {
      console.warn(err)
      return res.sendFile(path.resolve('./images/red.svg'))
    })
  })
})

app.listen(8080, () => console.log('Example app listening on port 8080!'))
