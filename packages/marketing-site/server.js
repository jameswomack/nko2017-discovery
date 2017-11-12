require('dotenv').load()

const path = require('path')
const express = require('express')
const packageJSON = require('./package')
const client = require('redis').createClient(process.env.REDIS_URL)
const app = express()

const PORT = packageJSON.config.port

// redis-backed sessions for fun and profit.
// https://github.com/tj/connect-redis
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

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

// parse application/json
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const log = (...msgs) => console.log(`[${packageJSON.name}]`, ...msgs)

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

app.get('/', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'))
})
app.use(express.static(path.join(__dirname, 'public')))

app.get('/js/app.js', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'js', 'app.js'))
})

// Github OAuth Login Routes.
const GitHubApi = require('github')
const github = new GitHubApi()
const SimpleOauth = require('simple-oauth2')
const oauth2 = SimpleOauth.create({
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  }
})

app.get('/auth', (req, res) => {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.GITHUB_CALLBACK || 'http://127.0.0.1:8082/callback',
    scope: 'read:user,user:email'
  })
  res.redirect(authorizationUri)
})

app.get('/callback', (req, res) => {
  const code = req.query.code
  const options = {code}

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message)
      return res.status(400).json('Authentication failed')
    }

    try {
      const token = oauth2.accessToken.create(result)
      github.authenticate({
        type: 'oauth',
        token: token.token.access_token
      })
      github.users.get({})
        .then(rawUser => {
          return saveUser(rawUser, token.token.access_token)
        }).then((user) => {
          req.session.user = user.name
          const redirect = req.session.redirect || '/'
          req.session.redirect = null
          return res.redirect(redirect)
        }).catch(err => {
          return res.status(500).json({
            error: err.message
          })
        })
    } catch (err) {
      return res.status(500).json({
        error: err.message
      })
    }
  })
})

function saveUser (rawUser, authToken) {
  const user = {
    name: rawUser.data.login,
    authToken: authToken,
    avatar: rawUser.data.avatar_url,
    email: rawUser.data.email,
    bio: rawUser.data.bio
  }
  const update = []
  Object.keys(user).forEach(key => {
    update.push(key, user[key])
  })

  return new Promise((resolve, reject) => {
    client.hmset(user.name, update, (err, res) => {
      if (err) return reject(err)
      else return resolve(user)
    })
  })
}

// API endpoints.
app.get('/v1/users/current', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(404).json({
      error: 'not found'
    })
  } else {
    client.hgetall(req.session.user, (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        })
      } else {
        return res.status(200).json({
          name: user.name,
          avatar: user.avatar,
          roomName: user.roomName,
          email: user.email,
          bio: user.bio,
          officeHoursBlurb: user.officeHoursBlurb || '',
          badge: user.badge || ''
        })
      }
    })
  }
})

app.listen(PORT, () => {
  log(`now live on ${PORT}`)

  require('opn')(`http://localhost:${PORT}`)
})
