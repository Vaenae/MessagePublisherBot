/* eslint-disable @typescript-eslint/camelcase */
import { setServerConfig } from '../../config/config'

const botToken = '123'
setServerConfig({ botToken, urlProd: 'localhost' })

import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import * as messages from '../../pages/api/messages/[publishId]'
import { saveMessages, MessageResult } from '../../database/messages'
import { saveChat } from '../../database/chats'
import { Chat, Message } from 'telegraf/typings/telegram-types'
import reverse from 'lodash/fp/reverse'

const testPublishId = 'test'
const testChat: Chat = {
    id: 1234,
    title: 'Test chat',
    type: 'supergroup'
}

function* generateMessage(totalMessages: number) {
    for (let i = 1; i <= totalMessages; i++) {
        yield {
            date: 1441644540 + i,
            chat: {
                id: testChat.id,
                title: 'Test chat',
                type: 'supergroup'
            },
            message_id: i,
            from: {
                last_name: 'Marx',
                id: -535,
                first_name: 'Karl',
                username: 'kmarx',
                is_bot: false
            },
            text: `Test message ${i}`
        }
    }
}

const testMessages: ReadonlyArray<Message> = [
    ...generateMessage(100),
    {
        date: 1441645532,
        chat: {
            id: testChat.id,
            title: 'Test chat',
            type: 'supergroup'
        },
        message_id: 101,
        from: {
            last_name: 'Test Lastname',
            id: 55,
            first_name: 'Test',
            username: 'Test',
            is_bot: false
        },
        text: '/start'
    },
    {
        date: 1441645533,
        chat: {
            id: testChat.id,
            title: 'Test chat',
            type: 'supergroup'
        },
        message_id: 102,
        from: {
            last_name: 'Mark',
            id: 41,
            first_name: 'Kugdi',
            username: 'K',
            is_bot: false
        },
        text: 'hello'
    },
    {
        date: 1441645540,
        chat: {
            id: testChat.id,
            title: 'Test chat',
            type: 'supergroup'
        },
        message_id: 103,
        from: {
            last_name: 'Jordan',
            id: 9663,
            first_name: 'Nap',
            username: 'Hougah',
            is_bot: false
        },
        text: 'go on'
    }
]

const messageToMessageResult = (message: Message): MessageResult => ({
    chatId: message.chat.id,
    messageId: message.message_id,
    date: message.date,
    text: message.text,
    from: message.from
        ? {
              id: message.from.id,
              username: message.from.username,
              lastName: message.from.last_name,
              firstName: message.from.first_name,
              isBot: message.from.is_bot
          }
        : undefined
})

describe('/api/messages handler', () => {
    let parameters: messages.MessagesQuery
    const requestHandler = (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        return apiResolver(req, res, parameters, messages)
    }
    const server = http.createServer(requestHandler)
    let baseUrl: string
    beforeAll(async () => {
        await saveChat(testPublishId, 0, testChat)
        await saveMessages(testMessages)
        baseUrl = await listen(server)
    })
    afterAll(() => {
        server.close()
    })
    test('responds 404 to POST', async () => {
        expect.assertions(1)
        const response = await fetch(baseUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ a: 1, b: 2 })
        })
        expect(response.status).toBe(404)
    })

    test('gets the messages with the publish id', async () => {
        expect.assertions(2)
        parameters = { publishId: testPublishId }
        const response = await fetch(baseUrl)
        expect(response.status).toBe(200)
        const expected: MessageResult[] = reverse(testMessages).map(
            messageToMessageResult
        )
        const data = await response.json()
        expect(data).toStrictEqual(expected)
    })

    test('gets the last 5 messages', async () => {
        expect.assertions(2)
        parameters = { publishId: testPublishId, max: '5' }
        const response = await fetch(baseUrl)
        expect(response.status).toBe(200)
        const expected: MessageResult[] = reverse(testMessages)
            .slice(0, 5)
            .map(messageToMessageResult)
        const data = await response.json()
        expect(data).toStrictEqual(expected)
    })
})
