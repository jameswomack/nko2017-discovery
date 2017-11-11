const express = require('express')
const app = express()

app.get('/', (req, res) => res.send("Hello I'm a marketing site!"))

app.listen(8082, () => console.log('Example app listening on port 8082!'))
