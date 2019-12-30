import React from 'react'
import { useState } from 'react'
import { Login } from './Login'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useUser } from '../pages/_app'

interface AuthenticatedUserProps {
    user: firebase.User
}

function logout() {
    firebase.auth().signOut()
}

function AuthenticatedUser(props: AuthenticatedUserProps) {
    return (
        <div id="authenticatedUser">
            <div id="displayName">{props.user.displayName}</div>
            <input type="button" value="Logout" onClick={logout}></input>
        </div>
    )
}

interface UnauthenticatedProps {
    loginOpen: boolean
    setLoginOpen: (open: boolean) => void
}

function Unauthenticated(props: UnauthenticatedProps) {
    return (
        <div id="unauthenticated">
            <input
                type="button"
                value="Login"
                onClick={() => props.setLoginOpen(!props.loginOpen)}
            ></input>
            <div
                className={
                    props.loginOpen
                        ? ''
                        : 'hidden' /* we need to always render login */
                }
            >
                <Login />
            </div>
            <style jsx>{`
                .hidden {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export function User() {
    const [loginOpen, setLoginOpen] = useState(false)
    const user = useUser()
    return user == null
        ? Unauthenticated({ loginOpen, setLoginOpen })
        : AuthenticatedUser({ user })
}
