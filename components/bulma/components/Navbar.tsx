import React, { Fragment, useState } from 'react'

export interface MenuItemProps {
    kind: 'navbar-item' | 'navbar-divider'
    children?: JSX.Element | string
    dropdownItems?: ReadonlyArray<MenuItemProps>
    href?: string
    as?: string
}

export interface NavbarProps {
    brandItems: ReadonlyArray<MenuItemProps>
    menuStart?: ReadonlyArray<MenuItemProps>
    menuEnd?: ReadonlyArray<MenuItemProps>
}

function MenuItem(props: MenuItemProps) {
    switch (props.kind) {
        case 'navbar-divider': {
            return (
                <Fragment>
                    <hr className="navbar-divider" />
                    <style jsx>
                        {`
                            @import 'node_modules/bulma/sass/utilities/_all.sass';
                            @import 'node_modules/bulma/sass/components/navbar.sass';
                        `}
                    </style>
                </Fragment>
            )
        }
        case 'navbar-item': {
            return (
                <Fragment>
                    {props.dropdownItems ? (
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">{props.children}</a>
                            <div className="navbar-dropdown">
                                {props.dropdownItems.map((item, index) => (
                                    <MenuItem key={index} {...item} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <a className="navbar-item">{props.children}</a>
                    )}
                    <style jsx>
                        {`
                            @import 'node_modules/bulma/sass/utilities/_all.sass';
                            @import 'node_modules/bulma/sass/components/navbar.sass';
                        `}
                    </style>
                </Fragment>
            )
        }
    }
}

export function Navbar(props: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const isActive = menuOpen ? 'is-active' : ''
    return (
        <Fragment>
            <nav
                className="navbar"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    {props.brandItems.map((item, index) => (
                        <MenuItem key={index} {...item} />
                    ))}
                    <a
                        role="button"
                        className={`navbar-burger burger ${isActive}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarBasicExample"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div
                    id="navbarBasicExample"
                    className={`navbar-menu ${isActive}`}
                >
                    {props.menuStart ? (
                        <div className="navbar-start">
                            {props.menuStart.map((item, index) => (
                                <MenuItem key={index} {...item} />
                            ))}
                        </div>
                    ) : null}
                    {props.menuEnd ? (
                        <div className="navbar-end">
                            {props.menuEnd.map((item, index) => (
                                <MenuItem key={index} {...item} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </nav>
            <style jsx>
                {`
                    @import 'node_modules/bulma/sass/utilities/_all.sass';
                    @import 'node_modules/bulma/sass/components/navbar.sass';
                `}
            </style>
        </Fragment>
    )
}
