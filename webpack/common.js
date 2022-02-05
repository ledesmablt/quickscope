const path = require('path')
const fs = require('fs')
const { ProvidePlugin } = require('webpack')

const IS_PROD = process.env.NODE_ENV === 'production'

const isManifest = (filePath) => {
  return filePath === path.join(__dirname, '..', 'static/manifest.json')
}
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'))
)

const setupManifest = (manifest) => {
  manifest.name = IS_PROD ? packageJson.name : `[dev] ${packageJson.name}`
  manifest.description = packageJson.description
  manifest.version = packageJson.version
}

const getCommonConfig = (browser) => ({
  devtool: !IS_PROD && 'inline-source-map',
  entry: {
    newTab: path.join(__dirname, '../src/NewTab/index.tsx'),
    backgroundScript: path.join(__dirname, '../src/backgroundScript.ts')
  },
  output: {
    path: path.join(__dirname, '..', IS_PROD ? 'dist_prod' : 'dist', browser),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      src: path.resolve(__dirname, '..', 'src'),
      logger: path.resolve(__dirname, '..', 'src/utils/logger')
    }
  },
  watch: !IS_PROD,
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
    })
  ]
})

module.exports = {
  getCommonConfig,
  isManifest,
  setupManifest,
  packageJson
}
