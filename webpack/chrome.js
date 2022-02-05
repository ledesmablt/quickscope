const { getCommonConfig, isManifest, packageJson } = require('./common')
const CopyPlugin = require('copy-webpack-plugin')

const commonConfig = getCommonConfig('chrome')

module.exports = {
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins,
    new CopyPlugin({
      patterns: [
        {
          from: 'static',
          to: '.',
          transform: (buffer, filePath) => {
            if (isManifest(filePath)) {
              const manifest = JSON.parse(buffer.toString())
              manifest.version = packageJson.version
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
