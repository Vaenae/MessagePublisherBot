import React, { Fragment } from 'react'

export interface ButtonProps {
    children?: JSX.Element | string
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function Button(props: ButtonProps) {
    return (
        <Fragment>
            <button className="button" onClick={props.onClick}>
                {props.children}
            </button>
            <style jsx>
                {`
                    @import 'node_modules/bulma/sass/utilities/_all.sass';
                    @import 'node_modules/bulma/sass/elements/button.sass';
                `}
            </style>
        </Fragment>
    )
}
