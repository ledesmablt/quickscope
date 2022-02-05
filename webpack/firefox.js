const { getCommonConfig, isManifest, packageJson } = require('./common')
const CopyPlugin = require('copy-webpack-plugin')
const _ = require('lodash')

const commonConfig = getCommonConfig('firefox')
const removeFromManifest = [
  'cross_origin_embedder_policy',
  'cross_origin_opener_policy'
]

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
              let manifest = JSON.parse(buffer.toString())
              manifest.version = packageJson.version
              manifest.manifest_version = 2
              manifest = _.omit(manifest, removeFromManifest)
              manifest.background = {
                scripts: [manifest.background.service_worker]
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
