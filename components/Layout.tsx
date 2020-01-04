import React from 'react'
// import Link from 'next/link'
import { User } from './User'
import { Navbar, MenuItemProps } from './bulma/components/Navbar'

interface LayoutProps {
    children: JSX.Element
}

const brandMenu: MenuItemProps[] = [
    { kind: 'navbar-item', children: 'Nextjs-cloud-template' }
]
const leftMenu: MenuItemProps[] = [
    {
        kind: 'navbar-item',
        children: 'Item 1',
        dropdownItems: [
            { kind: 'navbar-item', children: 'Subitem 1' },
            { kind: 'navbar-divider' },
            { kind: 'navbar-item', children: 'Subitem 2' }
        ]
    },
    { kind: 'navbar-item', children: 'Item 2' },
    { kind: 'navbar-item', children: 'Item 3' },
    { kind: 'navbar-item', children: 'Item 4' },
    { kind: 'navbar-divider' },
    { kind: 'navbar-item', children: 'Item 5' },
    { kind: 'navbar-item', children: 'Item 6' },
    { kind: 'navbar-item', children: 'Item 7' }
]
const rightMenu: MenuItemProps[] = [{ kind: 'navbar-item', children: <User /> }]

const Header = () => (
    <div>
        <Navbar
            brandItems={brandMenu}
            menuStart={leftMenu}
            menuEnd={rightMenu}
        />
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
