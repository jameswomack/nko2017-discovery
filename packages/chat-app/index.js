// File is slightly modified from the twilio video quickstart
// Load Twilio configuration from .env config file into process.env
require('dotenv').load()

const express = require('express')
const twilio = require('twilio')

const app = express()

const AccessToken = twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

// Serve static files from public folder.
app.use(express.static('public'))

app.get('/', (req, res) => res.send("Hello I'm a chat-app!"))

/**
 * Generate an Access Token for a chat application user. Takes a room id as a
 * query parameter. Generates an autoincrementing id for the user's identity.
 */
let id = 1
app.get('/token', function(req, res) {
  const identity = 'participant' + id
  id++

  // Create an access token which we will sign and return to the client,
  // containing the VideoGrant we just created.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

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

app.listen(8081, () => console.log('Example app listening on port 8081!'))
