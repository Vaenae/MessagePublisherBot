import React from 'react'
import dynamic from 'next/dynamic'
import firebase from 'firebase/app'
import 'firebase/auth'
import { StyledFirebaseAuth } from 'react-firebaseui'

// We want to get the current url from the window, that's why this is dynamic
export const Login = dynamic(
    () =>
        Promise.resolve(() => {
            const firebaseUiConfig = {
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
