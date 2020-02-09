import { deleteTable, dynamodb } from './database'
import {
    messagesTableName,
    createMessagesMigration
} from './migrations/2-create-messages'
import { IncomingMessage, User } from 'telegraf/typings/telegram-types'
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb'
import { IntString, toInt, toIntString } from '../util/intString'

export async function clearMessagesTable() {
    await deleteTable(messagesTableName)
    await createMessagesMigration.migrate()
}

type UserDbItem = {
    M?: {
        id: { N: IntString }
        username: { S?: string }
        lastName: { S?: string }
        firstName: { S: string }
        isBot: { BOOL: boolean }
    }
}

function toUserDbItem(user?: User): UserDbItem {
    return user
        ? {
              M: {
                  id: { N: toIntString(user.id) },
                  username: { S: user.username },
                  lastName: { S: user.last_name },
                  firstName: { S: user.first_name },
                  isBot: { BOOL: user.is_bot }
              }
          }
        : { M: undefined }
}

type MessageDbItem = {
    chatId: { N: IntString }
    messageId: { N: IntString }
    date: { N: IntString }
    text: { S?: string }
    from: UserDbItem
}

export interface UserResult {
    id: number
    username?: string
    lastName?: string
    firstName: string
    isBot: boolean
}

export interface MessageResult {
    chatId: number
    messageId: number
    date: number
    text?: string
    from?: UserResult
}

function toUserResult(item: UserDbItem): UserResult | undefined {
    return item.M
        ? {
              id: toInt(item.M.id.N),
              username: item.M.username?.S,
              lastName: item.M.lastName?.S,
              firstName: item.M.firstName.S,
              isBot: item.M.isBot.BOOL
          }
        : undefined
}

function toMessageResult(item: MessageDbItem): MessageResult {
    return {
        chatId: toInt(item.chatId.N),
        messageId: toInt(item.messageId.N),
        date: toInt(item.date.N),
        text: item.text?.S,
        from: toUserResult(item.from)
    }
}

export async function findMessage(
    chatId: string,
    messageId: string
): Promise<MessageResult | undefined> {
    const result = await dynamodb
        .getItem({
            TableName: messagesTableName,
            Key: { chatId: { N: chatId }, messageId: { N: messageId } }
        })
        .promise()
    return result.Item
        ? toMessageResult(result.Item as MessageDbItem)
        : undefined
}

function toMessageDbItem(message: IncomingMessage): MessageDbItem {
    return {
        chatId: { N: toIntString(message.chat.id) },
        messageId: { N: toIntString(message.message_id) },
        date: { N: toIntString(message.date) },
        text: { S: message.text },
        from: toUserDbItem(message.from)
    }
}

export async function saveMessage(message: IncomingMessage) {
    const messagedbItem: PutItemInputAttributeMap = toMessageDbItem(message)
    return await dynamodb
        .putItem({
            TableName: messagesTableName,
            Item: messagedbItem
        })
        .promise()
}
