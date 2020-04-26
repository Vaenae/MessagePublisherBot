import React from 'react'
import fetch from 'isomorphic-unfetch'
import { MessageResult } from '../database/messages'
import { NextPageContext } from 'next'
import { Table } from '../components/bulma/elements/Table'

interface PublishedProps {
    messages?: ReadonlyArray<MessageResult>
}

function showDateTime(timestamp: number) {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
}

const columns = ['', '', '', '']

const Published = (props: PublishedProps) => {
    const { messages } = props
    const rows = (messages || []).map((m) => [
        <span key={0}>{showDateTime(m.date)}</span>,
        <span key={1}>
            <strong>
                {m.from?.firstName} {m.from?.lastName}:
            </strong>
        </span>,
        <span key={2}>{m.text || ''}</span>
    ])
    return <Table header={columns} rows={rows} />
}

Published.getInitialProps = async (
    context: NextPageContext
): Promise<PublishedProps> => {
    const { publishId } = context.query
    const host = context.req?.headers.host
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const result = await fetch(
        `${protocol}://${host}/api/messages/${publishId}`
    )
    if (!result.ok) {
        return {}
    }
    const messages = await result.json()
    return { messages }
}

export default Published
