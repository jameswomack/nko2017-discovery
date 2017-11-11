const path = require('path')
const express = require('express')
const package = require('./package')

const app = express()
const PORT = package.config.port

const log = (...msgs) => console.log(`[${package.name}]`, ...msgs)

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

app.listen(PORT, (req, res) => {
	log(`now live on ${PORT}`)

	require('opn')(`http://localhost:${PORT}`)
})