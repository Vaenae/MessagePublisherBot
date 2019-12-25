const withCSS = require('@zeit/next-css')
module.exports = withCSS({
    cssModules: true,
    env: {
        FIREBASE_CLIENT_CONFIG: process.env.FIREBASE_CLIENT_CONFIG
    }
})
