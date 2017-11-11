const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const CWD = process.cwd()

const appEntry = [
  './client/css/app.css',
  './client/js/app.js'
]

if (process.env.NODE_ENV !== 'production')
  appEntry.unshift('react-hot-loader/patch',
    'webpack-hot-middleware/client?http://localhost:3000&reload=true')

module.exports = {
  entry: {
    app: appEntry
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
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!sass-loader'
        )
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css')
  ]
}
