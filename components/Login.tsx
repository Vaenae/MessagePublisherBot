import dynamic from 'next/dynamic'
import firebase from 'firebase/app'
import 'firebase/auth'
import { StyledFirebaseAuth, FirebaseAuth } from 'react-firebaseui'
import { clientConfig } from '../config/config'
import cookie from 'js-cookie'

export const login = (token: any) => {
    cookie.set('token', token, { expires: 1 })
}

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
                        console.log(authResult)
                        cookie.set('token', authResult.credential.toJSON())
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
