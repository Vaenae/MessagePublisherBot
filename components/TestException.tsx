import React from 'react'
import { Button } from './bulma/Button'

export function TestException() {
    const click = async () => {
        throw new Error('Troubleee')
    }
    return (
        <div>
            <Button onClick={click}>Test exception</Button>
        </div>
    )
}
