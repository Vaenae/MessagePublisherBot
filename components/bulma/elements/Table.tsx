import React, { Fragment } from 'react'

export interface TableProps {
    header: ReadonlyArray<JSX.Element | string>
    rows: ReadonlyArray<ReadonlyArray<JSX.Element | string>>
}

interface HeaderProps {
    columns: ReadonlyArray<JSX.Element | string>
}

function Header(props: HeaderProps) {
    return (
        <thead>
            <tr>
                {props.columns.map((column, index) => (
                    <th key={index}>{column}</th>
                ))}
            </tr>
        </thead>
    )
}

interface RowProps {
    columns: ReadonlyArray<JSX.Element | string>
}

function Row(props: RowProps) {
    return (
        <Fragment>
            {props.columns.map((column, index) => (
                <td key={index}>{column}</td>
            ))}
        </Fragment>
    )
}

export function Table(props: TableProps) {
    return (
        <Fragment>
            <table className="table is-bordered is-striped">
                <Header columns={props.header} />
                <tbody>
                    {props.rows.map((row, index) => (
                        <tr key={index}>
                            <Row columns={row} />
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>
                {`
                    @import 'node_modules/bulma/sass/utilities/_all.sass';
                    @import 'node_modules/bulma/sass/elements/table.sass';
                `}
            </style>
        </Fragment>
    )
}
