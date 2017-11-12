// load Twilio & Redis configuration from .env config file into process.env
require('dotenv').load()

const twilio = require('twilio')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

// redis-backed sessions for fun and profit.
// https://github.com/tj/connect-redis
const client = require('redis').createClient(process.env.REDIS_URL)
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const packageJSON = require('./package')

const app = express()
const PORT = packageJSON.config.port

const log = (...msgs) => console.log(`[${packageJSON.name}]`, ...msgs)

const uuid = require('uuid')

// store sessions in redis.
app.use(session({
  store: new RedisStore({
    client: client
  }),
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  cookie: {
    secure: process.NODE_ENV === 'production' ? true : false,
    sameSite: 'lax'
  },
  resave: true,
  saveUninitialized: true
}))

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('./webpack.config.js')

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: true
  }))

  app.use(webpackHotMiddleware(compiler))
}


const AccessToken = twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

/**
 * Generate an Access Token for a chat application user. Takes a room id as a
 * query parameter. Generates an autoincrementing id for the user's identity.
 */
let id = 1
app.post('/chat/token', bodyParser.json(), (req, res) => {
  const identity = req.body.participantId || `participant${id}`
  id++

  // Create an access token which we will sign and return to the client,
  // containing the VideoGrant we just created.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  )

  // Assign the generated identity to the token.
  token.identity = identity

  // Grant the access token Twilio Video capabilities.
  const grant = new VideoGrant()
  token.addGrant(grant)

  // Serialize the token to a JWT string and include it in a JSON response.
  res.send({
    identity,
    token: token.toJwt()
  })
})

app.get('/chat/user', (req, res) => {
  if (!req.session.user)
    return res.status(404).json({
      error: 'not found'
    })
  else
    client.hgetall(req.session.user, (err, user) => {
      if (err)
        return res.status(500).json({
          error: err.message
        })
      else
        return res.status(200).json({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          roomName: user.roomName,
          bio: user.bio,
          officeHoursBlurb: user.officeHoursBlurb || '',
          badge: user.badge || ''
        })

    })
})

// create a room to host the chat in.
app.post('/chat/room', bodyParser.json(), (req, res) => {
  if (!req.session.user) {
    return res.status(404).json({
      error: 'not found',
      redirect: process.env.LOGIN_REDIRECT + '?state=' + req.body.redirect
    })
  } else {
    const roomName = uuid.v4()
    client.hmset(req.session.user, [ 'room', roomName ], err => {
      if (err) {
        return res.status(500).json({
          error: err.message
        })
      } else {
        return res.status(200).json({
          ok: true,
          roomName: roomName
        })
      }
    })
  }
})

// grab the current room that a maintainer is in.
app.post('/chat/room/:user', bodyParser.json(), (req, res) => {
  if (!req.session.user) {
    return res.status(404).json({
      error: 'not found',
      redirect: process.env.LOGIN_REDIRECT + '?state=' + req.body.redirect
    })
  } else {
    client.hgetall(req.params.user, (err, resp) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        })
      } else {
        return res.status(200).json({
          ok: true,
          roomName: resp.room
        })
      }
    })
  }
})

app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'production') {
  app.get('/chat/js/app.js', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'js', 'app.js'))
  })
}

app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'))
})

app.listen(PORT, () => {
  log(`now live on ${PORT}`)

  require('opn')(`http://127.0.0.1:${PORT}`)
})
