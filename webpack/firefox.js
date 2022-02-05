const { getCommonConfig, isManifest, setupManifest } = require('./common')
const CopyPlugin = require('copy-webpack-plugin')
const _ = require('lodash')

const commonConfig = getCommonConfig('firefox')
const removeFromManifest = [
  'cross_origin_embedder_policy',
  'cross_origin_opener_policy'
]
const removeFromPermissions = ['tabGroups']
const filterPermissions = (permissions) => {
  return permissions.filter((p) => !removeFromPermissions.includes(p))
}

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
              setupManifest(manifest)

              // firefox-specific
              manifest.manifest_version = 2
              manifest = _.omit(manifest, removeFromManifest)
              manifest.permissions = filterPermissions(manifest.permissions)
              manifest.optional_permissions = filterPermissions(
                manifest.optional_permissions
              )
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
