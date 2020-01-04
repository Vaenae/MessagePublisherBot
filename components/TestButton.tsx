import React from 'react'
import fetch from 'isomorphic-unfetch'
import { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Button } from './bulma/elements/Button'

export function TestButton() {
    const [status, setStatus] = useState<string | null>(null)
    const [result, setResult] = useState<string | null>(null)
    const click = async () => {
        const currentUser = firebase.auth().currentUser
        if (currentUser == null) {
            setStatus('Not authenticated')
        } else {
            const result = await fetch('/api/test', {
                headers: {
                    Authorization: await currentUser.getIdToken(true)
                }
            })
            setStatus(result.statusText)
            setResult(await result.text())
        }
    }
    return (
        <div>
            <Button onClick={click}>Test button</Button>
            <div>Status: {status}</div>
            <div>Result: {result}</div>
        </div>
    )
}
