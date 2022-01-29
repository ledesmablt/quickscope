require('dotenv').config()

const path = require('path')
const fs = require('fs')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { ProvidePlugin } = require('webpack')

const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    popup: './src/Popup/index.tsx',
    newTab: './src/NewTab/index.tsx',
    backgroundScript: './src/backgroundScript.ts'
  },
  output: {
    path: path.join(__dirname, IS_PROD ? 'dist_prod' : 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      logger: path.resolve(__dirname, 'src/utils/logger')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /\.module\.css$/
      }
    ]
  },
  mode: IS_PROD ? 'production' : 'development',
  stats: IS_PROD ? 'normal' : 'minimal',
  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
      logger: 'logger'
    }),
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        {
          from: 'static',
          to: '.',
          transform: (buffer, filePath) => {
            if (filePath === path.join(__dirname, 'static/manifest.json')) {
              const manifest = JSON.parse(buffer.toString())
              const package = JSON.parse(fs.readFileSync('package.json'))
              manifest.version = package.version
              manifest.externally_connectable = {
                ids: [process.env.EXTENSION_ID],
                matches: [`${process.env.APP_URL}/*`]
              }
              return Buffer.from(JSON.stringify(manifest))
            } else {
              return buffer
            }
          }
        }
      ]
    })
  ]
}
