const express = require('express')
const app = express()
const client = require('redis').createClient(process.env.REDIS_URL)

client.set('foo', '99', () => {})

app.get('/', (req, res) => res.send("Hello I'm a badges server!"))

app.listen(8080, () => console.log('Example app listening on port 8080!'))
