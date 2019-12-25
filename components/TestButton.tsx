import fetch from 'isomorphic-unfetch'
import { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

export function TestButton() {
    const [status, setStatus] = useState<string>(undefined)
    const [result, setResult] = useState<string>(undefined)
    const click = async () => {
        const currentUser = firebase.auth().currentUser
        if (currentUser === undefined) {
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
            <input type="button" value="Test button" onClick={click}></input>
            <div>Status: {status}</div>
            <div>Result: {result}</div>
        </div>
    )
}
