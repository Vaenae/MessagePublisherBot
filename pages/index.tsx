import React, { Fragment } from 'react'
import { TestButton } from '../components/TestButton'
import { TestException } from '../components/TestException'
import Layout from '../components/Layout'

const Home = () => {
    return (
        <Layout>
            <Fragment>
                <h1>Hello</h1>
                <TestButton />
                <TestException />
            </Fragment>
        </Layout>
    )
}

export default Home
