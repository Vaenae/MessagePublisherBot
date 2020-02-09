import { deleteTable, dynamodb } from './database'
import {
    messagesTableName,
    createMessagesMigration
} from './migrations/1-create-messages'
import { IncomingMessage, User } from 'telegraf/typings/telegram-types'
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb'

export async function clearMessagesTable() {
    await deleteTable(messagesTableName)
    await createMessagesMigration.migrate()
}

type IntString = string

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
                  id: { N: user.id.toString(10) },
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

const toInt = (str: IntString): number => parseInt(str, 10)

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

export async function findMessage(chatId: string, messageId: string) {
    const result = await dynamodb
        .getItem({
            TableName: messagesTableName,
            Key: { chatId: { N: chatId }, messageId: { N: messageId } }
        })
        .promise()
    return toMessageResult(result.Item as MessageDbItem)
}

function toMessageDbItem(message: IncomingMessage): MessageDbItem {
    return {
        chatId: { N: message.chat.id.toString(10) },
        messageId: { N: message.message_id.toString(10) },
        date: { N: message.date.toString(10) },
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
