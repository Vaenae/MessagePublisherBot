const withCSS = require('@zeit/next-css')
const webpack = require('webpack')
const nextSourceMaps = require('@zeit/next-source-maps')()
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

module.exports = nextSourceMaps(
    withCSS({
        cssModules: true,
        env: {
            FIREBASE_CLIENT_CONFIG: process.env.FIREBASE_CLIENT_CONFIG,
            SENTRY_DSN: process.env.SENTRY_DSN
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

            return config
        }
    })
)
