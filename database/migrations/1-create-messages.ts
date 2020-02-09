import { getServerConfig } from '../../config/config'
import { Migration } from './utils'
import { createTable } from '../database'

export const messagesTableName = `${getServerConfig().tablePrefix}-messages`

async function migrate() {
    await createTable({
        TableName: messagesTableName,
        AttributeDefinitions: [
            {
                AttributeName: 'chatId',
                AttributeType: 'N'
            },
            {
                AttributeName: 'messageId',
                AttributeType: 'N'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'chatId',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'messageId',
                KeyType: 'RANGE'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    })
}

export const createMessagesMigration: Migration = {
    name: 'Create messages table',
    migrate
}
