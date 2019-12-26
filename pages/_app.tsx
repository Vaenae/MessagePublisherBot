import React from 'react'
import App from 'next/app'
import * as Sentry from '@sentry/node'
import { clientConfig } from '../config/config'

Sentry.init({
    dsn: clientConfig.sentryDsn
})

interface MyAppProps {
    err: Error
}

class MyApp extends App<MyAppProps> {
    render() {
        const { Component, pageProps, err } = this.props
        const modifiedPageProps = { ...pageProps, err }

        return <Component {...modifiedPageProps} />
    }
}

export default MyApp
