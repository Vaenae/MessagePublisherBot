import { NextApiRequest, NextApiResponse } from 'next'
import { findChat } from '../../../database/chats'
import { queryMessagesByChatId } from '../../../database/messages'
import { IntString, toInt } from '../../../util/intString'
import { getFirstIfArray } from '../../../util/array'

export interface MessagesQuery {
    publishId?: string
    max?: IntString
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { publishId, max },
        method
    } = req
    if (method !== 'GET') {
        console.error(`Got message with method ${method}`)
        res.status(404)
        res.end()
        return
    }
    if (publishId == null) {
        console.error(`Got message with no pid ${publishId}`)
        res.status(404)
        res.end()
        return
    }
    const id = getFirstIfArray(publishId)
    const chat = await findChat(id)
    if (chat == null) {
        res.status(404)
        res.end()
        return
    }
    const results = await queryMessagesByChatId(
        chat.chatId,
        max ? toInt(getFirstIfArray(max)) : undefined
    )
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(results))
}
