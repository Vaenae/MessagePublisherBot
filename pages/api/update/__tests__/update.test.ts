import { setServerConfig } from '../../../../config/config'

const botToken = '123'
setServerConfig({ botToken })

import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import * as update from '../[pid]'
import { Update } from 'telegraf/typings/telegram-types'

/* eslint-disable @typescript-eslint/camelcase */
const testMessage: Update = {
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

    test('responds 200 to a valid post', async () => {
        expect.assertions(1)
        parameters = { pid: botToken }
        const response = await fetch(baseUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(testMessage)
        })
        expect(response.status).toBe(200)
    })
})
