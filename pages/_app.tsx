import React, { useContext } from 'react'
import { AppProps } from 'next/app'
import * as Sentry from '@sentry/node'
import { clientConfig } from '../config/config'

Sentry.init({
    dsn: clientConfig.sentryDsn,
    release: process.env.NOW_GITHUB_COMMIT_SHA
})

interface MyAppProps {
    err: Error
}

function MyApp(props: AppProps & MyAppProps) {
    const { Component, pageProps, err } = props
    const modifiedPageProps = { ...pageProps, err }

    return <Component {...modifiedPageProps} />
}

export default MyApp
