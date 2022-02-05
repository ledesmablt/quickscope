const { getCommonConfig, isManifest, setupManifest } = require('./common')
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')

const commonConfig = getCommonConfig('chrome')

module.exports = {
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins,
    new DefinePlugin({
      'process.env.BROWSER': JSON.stringify('chrome'),
      browser: 'chrome'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'static',
          to: '.',
          transform: (buffer, filePath) => {
            if (isManifest(filePath)) {
              const manifest = JSON.parse(buffer.toString())
              setupManifest(manifest)
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
