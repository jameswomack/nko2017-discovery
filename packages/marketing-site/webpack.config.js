const webpack = require('webpack')

const CWD = process.cwd()

module.exports = {
  entry: {
    app : [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?http://localhost:3000&reload=true',
      './client/css/app.css',
      './client/js/app.js'
    ]
  },
  output: {
    filename: 'js/[name].js',
    publicPath: '/',
    path: `${CWD}/public`
  },
  module: {
    loaders:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:['netflix-dea']
        }
      },
      {
        test: /\.html$/,
        loader:'html-loader'
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
