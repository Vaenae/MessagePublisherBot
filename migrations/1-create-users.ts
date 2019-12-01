import { config } from '../config/config'
import { createTable, Migration } from './utils'

const userTableName = `${config.tablePrefix}-users`

async function migrate() {
    await createTable({
        TableName: userTableName,
        AttributeDefinitions: [
            {
                AttributeName: 'userId',
                AttributeType: 'N'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'userId',
                KeyType: 'HASH'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    })
}

export const createUsersMigration: Migration = {
    name: 'Create users',
    migrate
}
