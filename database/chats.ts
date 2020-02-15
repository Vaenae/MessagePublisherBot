import {
    chatsTableName,
    createChatsMigration
} from './migrations/3-create-chat'
import { deleteTable, dynamodb } from './database'
import { IntString, toIntString, toInt } from '../util/intString'
import { Chat } from 'telegraf/typings/telegram-types'
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb'

export async function clearChatsTable() {
    await deleteTable(chatsTableName)
    await createChatsMigration.migrate()
}

type ChatDbItem = {
    chatPublishId: { S: string }
    chatId: { N: IntString }
    title?: { S: string }
    firstMessage: { N: IntString }
}

export type ChatResult = {
    chatPublishId: string
    chatId: number
    title?: string
    firstMessage: number
}

function toChatDbItem(
    publishId: string,
    firstMessage: number,
    chat: Chat
): ChatDbItem {
    return {
        chatPublishId: { S: publishId },
        chatId: { N: toIntString(chat.id) },
        title: chat.title ? { S: chat.title } : undefined,
        firstMessage: { N: toIntString(firstMessage) }
    }
}

function toChatResult(dbItem: ChatDbItem): ChatResult {
    return {
        chatPublishId: dbItem.chatPublishId.S,
        chatId: toInt(dbItem.chatId.N),
        title: dbItem.title?.S,
        firstMessage: toInt(dbItem.firstMessage.N)
    }
}

export async function saveChat(
    publishId: string,
    firstMessage: number,
    chat: Chat
) {
    return await dynamodb
        .putItem({
            TableName: chatsTableName,
            Item: toChatDbItem(
                publishId,
                firstMessage,
                chat
            ) as PutItemInputAttributeMap
        })
        .promise()
}

export async function findChat(
    publishId: string
): Promise<ChatResult | undefined> {
    const result = await dynamodb
        .getItem({
            TableName: chatsTableName,
            Key: { chatPublishId: { S: publishId } }
        })
        .promise()
    return result.Item ? toChatResult(result.Item as ChatDbItem) : undefined
}

export async function queryChatsByChatId(
    chatId: number
): Promise<ChatResult[]> {
    const result = await dynamodb
        .query({
            TableName: chatsTableName,
            IndexName: 'chatId',
            KeyConditionExpression: 'chatId = :id',
            ExpressionAttributeValues: { ':id': { N: toIntString(chatId) } }
        })
        .promise()
    return result.Items
        ? result.Items.map(i => toChatResult(i as ChatDbItem))
        : []
}

export async function deleteChats(chatPublishIds: ReadonlyArray<string>) {
    return await Promise.all(
        chatPublishIds.map(id =>
            dynamodb
                .deleteItem({
                    TableName: chatsTableName,
                    Key: { chatPublishId: { S: id } }
                })
                .promise()
        )
    )
}
