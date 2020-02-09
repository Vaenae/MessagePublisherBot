import { getServerConfig } from '../../config/config'
import { Migration } from './utils'
import { createTable } from '../database'

export const chatsTableName = `${getServerConfig().tablePrefix}-chats`

async function migrate() {
    await createTable({
        TableName: chatsTableName,
        AttributeDefinitions: [
            {
                AttributeName: 'chatPublishId',
                AttributeType: 'S'
            },
            {
                AttributeName: 'chatId',
                AttributeType: 'N'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'chatPublishId',
                KeyType: 'HASH'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'chatId',
                KeySchema: [{ AttributeName: 'chatId', KeyType: 'HASH' }],
                Projection: { ProjectionType: 'ALL' },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ]
    })
}

export const createChatsMigration: Migration = {
    name: 'Create chats table',
    migrate
}
