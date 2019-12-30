/* eslint-disable @typescript-eslint/no-var-requires */
const withCSS = require('@zeit/next-css')
const webpack = require('webpack')
const nextSourceMaps = require('@zeit/next-source-maps')()

module.exports = nextSourceMaps(
    withCSS({
        cssModules: true,
        env: {
            FIREBASE_CLIENT_CONFIG: process.env.FIREBASE_CLIENT_CONFIG,
            SENTRY_DSN: process.env.SENTRY_DSN,
            NOW_GITHUB_COMMIT_SHA: process.env.NOW_GITHUB_COMMIT_SHA
        },
        webpack: (config, { isServer, buildId }) => {
            config.plugins.push(
                new webpack.DefinePlugin({
                    'process.env.SENTRY_RELEASE': buildId
                })
            )

            if (!isServer) {
                config.resolve.alias['@sentry/node'] = '@sentry/browser'
            }

            config.node = {
                fs: 'empty'
            }

            return config
        }
    })
)
