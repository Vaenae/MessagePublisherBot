import { setServerConfig } from '../../../../config/config'

const botToken = '123'
setServerConfig({ botToken })

import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import * as update from '../[pid]'
import { Update } from 'telegraf/typings/telegram-types'
import {
    clearMessagesTable,
    findMessage,
    MessageResult
} from '../../../../database/messages'

/* eslint-disable @typescript-eslint/camelcase */
const testUpdate = {
    update_id: 10000,
    message: {
        date: 1441645532,
        chat: {
            id: 1111111,
            title: 'Test chat',
            type: 'supergroup'
        },
        message_id: 1365,
        from: {
            last_name: 'Test Lastname',
            id: 1111111,
            first_name: 'Test',
            username: 'Test',
            is_bot: false
        },
        text: '/start'
    }
}
/* eslint-enable */

describe('/api/update handler', () => {
    let parameters: { pid?: string } = {}
    const requestHandler = (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        return apiResolver(req, res, parameters, update)
    }
    const server = http.createServer(requestHandler)
    let baseUrl: string
    beforeAll(async () => {
        await clearMessagesTable()
        baseUrl = await listen(server)
    })
    afterAll(() => {
        server.close()
    })
    test('responds 404 to GET', async () => {
        expect.assertions(1)
        parameters = { pid: botToken }
        const response = await fetch(baseUrl)
        expect(response.status).toBe(404)
    })

    test('responds 404 to POST with bad id', async () => {
        expect.assertions(1)
        parameters = { pid: '1' }
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

    test('saves a message to the db', async () => {
        expect.assertions(2)
        parameters = { pid: botToken }
        const response = await fetch(baseUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(testUpdate)
        })
        expect(response.status).toBe(200)
        const dbResult = await findMessage(
            testUpdate.message.chat.id.toString(10),
            testUpdate.message.message_id.toString(10)
        )
        const expected: MessageResult = {
            chatId: testUpdate.message.chat.id,
            messageId: testUpdate.message.message_id,
            date: testUpdate.message.date,
            text: testUpdate.message.text,
            from: {
                id: testUpdate.message.from.id,
                username: testUpdate.message.from.username,
                lastName: testUpdate.message.from.last_name,
                firstName: testUpdate.message.from.first_name,
                isBot: testUpdate.message.from.is_bot
            }
        }
        expect(dbResult).toEqual(expected)
    })
})
