import React from 'react'
import fetch from 'isomorphic-unfetch'
import { MessageResult } from '../database/messages'
import { NextPageContext } from 'next'
import { Card } from '../components/bulma/components/Card'

interface PublishedProps {
    messages?: ReadonlyArray<MessageResult>
}

// function showDateTime(timestamp: number) {
//     const date = new Date(timestamp * 1000)
//     return date.toLocaleString()
// }

const Published = (props: PublishedProps) => {
    const { messages } = props
    const rows = (messages || []).map((m) => (
        <Card key={m.messageId}>{m.text}</Card>
    ))
    return <div>{rows}</div>
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
