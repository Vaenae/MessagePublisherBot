/* eslint-disable @typescript-eslint/camelcase */
import { setServerConfig } from '../../../../config/config'

const botToken = '123'
setServerConfig({ botToken, urlProd: 'localhost' })

import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import * as messages from '../[publishId]'
import { saveMessages, MessageResult } from '../../../../database/messages'
import { saveChat } from '../../../../database/chats'
import { Chat, Message } from 'telegraf/typings/telegram-types'

const testPublishId = 'test'
const testChat: Chat = {
    id: 1234,
    title: 'Test chat',
    type: 'supergroup'
}

const testMessages: Message[] = [
    {
        date: 1441645532,
        chat: {
            id: testChat.id,
            title: 'Test chat',
            type: 'supergroup'
        },
        message_id: 1,
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
        message_id: 2,
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
        message_id: 3,
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

describe('/api/messages handler', () => {
    const parameters: messages.MessagesQuery = { publishId: testPublishId }
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
        const response = await fetch(baseUrl)
        expect(response.status).toBe(200)
        const expected: MessageResult[] = testMessages.map(m => ({
            chatId: m.chat.id,
            messageId: m.message_id,
            date: m.date,
            text: m.text,
            from: m.from
                ? {
                      id: m.from.id,
                      username: m.from.username,
                      lastName: m.from.last_name,
                      firstName: m.from.first_name,
                      isBot: m.from.is_bot
                  }
                : undefined
        }))
        const data = await response.json()
        expect(data).toStrictEqual(expected)
    })
})
