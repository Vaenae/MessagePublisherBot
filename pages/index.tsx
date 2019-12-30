import React from 'react'
import { TestButton } from '../components/TestButton'
import { TestException } from '../components/TestException'
import { User } from '../components/User'

const Home = () => {
    return (
        <div>
            <User />
            <h1>Hello</h1>
            <TestButton />
            <TestException />
        </div>
    )
}

export default Home
