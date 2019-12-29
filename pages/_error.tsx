import React from 'react'
import NextError from 'next/error'
import * as Sentry from '@sentry/node'
import { NextPageContext } from 'next'
import firebase from 'firebase/app'
import 'firebase/auth'

interface MyErrorProps {
    statusCode: number
    hasGetInitialPropsRun: boolean
    err: Error
}

const setSentryUser = () => {
    try {
        const user = firebase.auth().currentUser
        console.log('User: ', user)
        if (user != null) {
            Sentry.setUser({
                id: user.uid,
                email: user.email,
                username: user.displayName
            })
        }
    } catch {}
}

const MyError = ({ statusCode, hasGetInitialPropsRun, err }: MyErrorProps) => {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/zeit/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        setSentryUser()
        Sentry.captureException(err)
    }

    return <NextError statusCode={statusCode} />
}

MyError.getInitialProps = async (pageContext: NextPageContext) => {
    const errorInitialProps = {
        ...(await NextError.getInitialProps(pageContext)),
        hasGetInitialPropsRun: true
    }

    setSentryUser()

    if (pageContext.res) {
        // Running on the server, the response object is available.
        //
        // Next.js will pass an err on the server if a page's `getInitialProps`
        // threw or returned a Promise that rejected

        if (pageContext.res.statusCode === 404) {
            // Opinionated: do not record an exception in Sentry for 404
            return { statusCode: 404 }
        }

        if (pageContext.err) {
            Sentry.captureException(pageContext.err)

            return errorInitialProps
        }
    } else {
        // Running on the client (browser).
        //
        // Next.js will provide an err if:
        //
        //  - a page's `getInitialProps` threw or returned a Promise that rejected
        //  - an exception was thrown somewhere in the React lifecycle (render,
        //    componentDidMount, etc) that was caught by Next.js's React Error
        //    Boundary. Read more about what types of exceptions are caught by Error
        //    Boundaries: https://reactjs.org/docs/error-boundaries.html
        if (pageContext.err) {
            Sentry.captureException(pageContext.err)

            return errorInitialProps
        }
    }

    // If this point is reached, getInitialProps was called without any
    // information about what the error might be. This is unexpected and may
    // indicate a bug introduced in Next.js, so record it in Sentry
    Sentry.captureException(
        new Error(
            `_error.js getInitialProps missing data at path: ${pageContext.asPath}`
        )
    )

    return errorInitialProps
}

export default MyError
