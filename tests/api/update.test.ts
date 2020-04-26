/* eslint-disable @typescript-eslint/camelcase */
import { setServerConfig } from '../../config/config'

const botToken = '123'
setServerConfig({ botToken, urlProd: 'localhost' })

import update from '../../pages/api/update/[pid]'
import { findMessage, MessageResult } from '../../database/messages'
import { toIntString } from '../../util/intString'
import { queryChatsByChatId, saveChat } from '../../database/chats'
import { Update, User } from 'telegraf/typings/telegram-types'
import { createMocks, RequestMethod } from 'node-mocks-http'
import { NextApiRequest, NextApiResponse } from 'next'

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

type UpdateBody = Required<Pick<Update, 'update_id' | 'message'>> & {
    message: { from: User }
}

const runUpdate = async (
    pid: string,
    body: UpdateBody,
    method: RequestMethod = 'POST'
) => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        query: { pid },
        method,
        body
    })
    await update(req, res)
    return res
}

describe('/api/update handler', () => {
    test('responds 404 to GET', async () => {
        expect.assertions(1)
        const response = await runUpdate(botToken, testUpdate, 'GET')
        expect(response._getStatusCode()).toBe(404)
    })

    test('responds 404 to POST with bad id', async () => {
        expect.assertions(1)
        const response = await runUpdate('1', testUpdate)
        expect(response._getStatusCode()).toBe(404)
    })

    const expectToSave = (update: UpdateBody) => async () => {
        expect.assertions(2)
        const response = await runUpdate(botToken, update)
        expect(response._getStatusCode()).toBe(200)
        const dbResult = await findMessage(
            toIntString(update.message.chat.id),
            toIntString(update.message.message_id)
        )
        const expected: MessageResult = {
            chatId: update.message.chat.id,
            messageId: update.message.message_id,
            date: update.message.date,
            text: update.message.text,
            from: {
                id: update.message.from.id,
                username: update.message.from.username,
                lastName: update.message.from.last_name,
                firstName: update.message.from.first_name,
                isBot: update.message.from.is_bot
            }
        }
        expect(dbResult).toEqual(expected)
    }

    test('saves a message to the db', expectToSave(testUpdate))

    test("don't save messages from private conversations", async () => {
        expect.assertions(2)
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
        const response = await runUpdate(botToken, privateUpdate)
        expect(response._getStatusCode()).toBe(200)
        const dbResult = await findMessage(
            toIntString(privateUpdate.message.chat.id),
            toIntString(privateUpdate.message.message_id)
        )
        expect(dbResult).toBeUndefined()
    })

    test('/publish starts publishing the channel', async () => {
        expect.assertions(3)
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
        const response = await runUpdate(botToken, publishUpdate)
        expect(response._getStatusCode()).toBe(200)
        const dbResults = await queryChatsByChatId(
            publishUpdate.message.chat.id
        )
        expect(dbResults.length).toEqual(1)
        expect(dbResults[0].firstMessage).toEqual(
            publishUpdate.message.message_id
        )
    })

    test('/unpublish stops publishing the channel', async () => {
        expect.assertions(2)
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

        const response = await runUpdate(botToken, unpublishUpdate)

        expect(response._getStatusCode()).toBe(200)
        const dbResults = await queryChatsByChatId(
            unpublishUpdate.message.chat.id
        )
        expect(dbResults.length).toEqual(0)
    })

    test(
        'saves a message without an username',
        expectToSave({
            ...testUpdate,
            update_id: testUpdate.update_id + 4,
            message: {
                ...testUpdate.message,
                message_id: testUpdate.message.message_id + 4,
                from: {
                    ...testUpdate.message.from,
                    username: undefined,
                    last_name: undefined
                }
            }
        })
    )
})
