const express = require('express')
const app = express()

app.get('/', (req, res) => res.send("Hello I'm a chat-app!"))

app.listen(8081, () => console.log('Example app listening on port 8081!'))
