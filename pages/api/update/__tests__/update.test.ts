/* eslint-disable @typescript-eslint/camelcase */
import { setServerConfig } from '../../../../config/config'

const botToken = '123'
setServerConfig({ botToken, urlProd: 'localhost' })

import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import * as update from '../[pid]'
import {
    clearMessagesTable,
    findMessage,
    MessageResult
} from '../../../../database/messages'
import { toIntString } from '../../../../util/intString'
import {
    queryChatsByChatId,
    clearChatsTable,
    saveChat
} from '../../../../database/chats'

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
            toIntString(testUpdate.message.chat.id),
            toIntString(testUpdate.message.message_id)
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

    test("don't save messages from private conversations", async () => {
        expect.assertions(2)
        parameters = { pid: botToken }
        const privateUpdate = {
            ...testUpdate,
            update_id: testUpdate.update_id + 1,
            message: {
                ...testUpdate.message,
                message_id: testUpdate.message.message_id + 1,
                chat: {
                    id: testUpdate.message.chat.id + 1,
                    type: 'private'
                }
            }
        }
        const response = await fetch(baseUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(privateUpdate)
        })
        expect(response.status).toBe(200)
        const dbResult = await findMessage(
            toIntString(privateUpdate.message.chat.id),
            toIntString(privateUpdate.message.message_id)
        )
        expect(dbResult).toBeUndefined()
    })

    test('/publish starts publishing the channel', async () => {
        expect.assertions(2)
        parameters = { pid: botToken }
        const publishUpdate = {
            ...testUpdate,
            update_id: testUpdate.update_id + 2,
            message: {
                ...testUpdate.message,
                message_id: testUpdate.message.message_id + 2,
                chat: {
                    ...testUpdate.message.chat,
                    id: testUpdate.message.chat.id + 2
                },
                text: '/publish'
            }
        }
        const response = await fetch(baseUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(publishUpdate)
        })
        expect(response.status).toBe(200)
        const dbResults = await queryChatsByChatId(
            publishUpdate.message.chat.id
        )
        expect(dbResults.length).toEqual(1)
    })

    test('/unpublish stops publishing the channel', async () => {
        expect.assertions(2)
        parameters = { pid: botToken }

        const unpublishUpdate = {
            ...testUpdate,
            update_id: testUpdate.update_id + 3,
            message: {
                ...testUpdate.message,
                message_id: testUpdate.message.message_id + 3,
                chat: {
                    ...testUpdate.message.chat,
                    id: testUpdate.message.chat.id + 3
                },
                text: '/unpublish'
            }
        }

        const publishId = 'testUnpublish'
        await saveChat(publishId, 0, unpublishUpdate.message.chat)

        const response = await fetch(baseUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(unpublishUpdate)
        })

        expect(response.status).toBe(200)
        const dbResults = await queryChatsByChatId(
            unpublishUpdate.message.chat.id
        )
        expect(dbResults.length).toEqual(0)
    })
})
