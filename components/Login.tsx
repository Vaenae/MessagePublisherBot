import dynamic from 'next/dynamic'
import firebase from 'firebase/app'
import 'firebase/auth'
import { StyledFirebaseAuth, FirebaseAuth } from 'react-firebaseui'
import { clientConfig } from '../config/config'
import * as Sentry from '@sentry/node'

if (!firebase.apps.length) {
    firebase.initializeApp(clientConfig.firebaseClientConfig)
}

// We want to get the current url from the window, that's why this is dynamic
export const Login = dynamic(
    () =>
        Promise.resolve(() => {
            const firebaseUiConfig = {
                callbacks: {
                    signInSuccessWithAuthResult: function(
                        authResult: firebase.auth.UserCredential
                    ) {
                        Sentry.setUser({
                            id: authResult.user.uid,
                            email: authResult.user.email,
                            username: authResult.user.displayName
                        })
                        return true
                    }
                },
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ],
                signInSuccessUrl: window.location.href
            }
            return (
                <StyledFirebaseAuth
                    uiConfig={firebaseUiConfig}
                    firebaseAuth={firebase.auth()}
                />
            )
        }),
    { ssr: false }
)
