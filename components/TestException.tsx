import React from 'react'

export function TestException() {
    const click = async () => {
        throw new Error('Troubleee')
    }
    return (
        <div>
            <input type="button" value="Test exception" onClick={click}></input>
        </div>
    )
}
