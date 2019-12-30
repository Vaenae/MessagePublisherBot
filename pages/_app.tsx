import React, { useContext } from 'react'
import { AppProps } from 'next/app'
import * as Sentry from '@sentry/node'
import { clientConfig } from '../config/config'
import firebase from 'firebase/app'
import 'firebase/auth'

Sentry.init({
    dsn: clientConfig.sentryDsn,
    release: process.env.NOW_GITHUB_COMMIT_SHA
})

const setSentryUser = (user: firebase.User | null) => {
    console.log('User: ', user)
    if (user != null) {
        Sentry.setUser({
            id: user.uid,
            email: user.email || undefined,
            username: user.displayName || undefined
        })
    } else {
        Sentry.setUser(null)
    }
}

if (!firebase.apps.length) {
    firebase.initializeApp(clientConfig.firebaseClientConfig)
}

const userContext = React.createContext<firebase.User | null>(null)

export const useUser = (): firebase.User | null => {
    return useContext(userContext)
}

export const useAuth = (): firebase.User | null => {
    const [state, setState] = React.useState(() => {
        return firebase.auth().currentUser
    })
    function onChange(user: firebase.User | null) {
        setSentryUser(user)
        setState(user)
    }

    React.useEffect(() => {
        // listen for auth state changes
        const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
        // unsubscribe to the listener when unmounting
        return () => unsubscribe()
    }, [])

    return state
}

interface MyAppProps {
    err: Error
}

function MyApp(props: AppProps & MyAppProps) {
    const { Component, pageProps, err } = props
    const user = useAuth()
    const modifiedPageProps = { ...pageProps, err }

    return (
        <userContext.Provider value={user}>
            <Component {...modifiedPageProps} />
        </userContext.Provider>
    )
}

export default MyApp
