import React, { Fragment } from 'react'
import fetch from 'isomorphic-unfetch'
import { MessageResult } from '../database/messages'
import { NextPageContext } from 'next'

interface PublishedProps {
    messages?: ReadonlyArray<MessageResult>
}

const Published = (props: PublishedProps) => {
    const { messages } = props
    return (
        <Fragment>
            {(messages || []).map(message => (
                <div key={message.messageId}>{message.text}</div>
            ))}
        </Fragment>
    )
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
