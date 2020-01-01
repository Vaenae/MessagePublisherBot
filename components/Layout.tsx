import React from 'react'
import Link from 'next/link'
import { User } from './User'

interface LayoutProps {
    children: JSX.Element
}

const Header = () => (
    <div>
        <User />
    </div>
)

const Layout = (props: LayoutProps) => {
    return (
        <div>
            <Header />
            {props.children}
        </div>
    )
}

export default Layout
