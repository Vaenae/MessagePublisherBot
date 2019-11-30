import AWS from 'aws-sdk'
import { global } from '../config/config'
import { CreateTableInput } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

var options = { region: 'localhost', endpoint: 'http://localhost:8000' }
var dynamodb = new AWS.DynamoDB(options)
// var docClient = new AWS.DynamoDB.DocumentClient(options)

// var args = process.argv.slice(2)

interface Migration {
    id: number
    name: string
    migrate: () => Promise<void>
}

async function listTables() {
    return await dynamodb
        .listTables()
        .promise()
        .then(data => data.TableNames)
}

async function createTable(table: CreateTableInput) {
    const result = await dynamodb.createTable(table).promise()
    console.log(result.TableDescription)
}

const migrationTableName = `${global.tablePrefix}-migrations`

async function createMigrationTable() {
    const existingTables = await listTables()
    console.log('Existing tables: ' + existingTables)
    if (!existingTables.includes(migrationTableName)) {
        console.log('Migration table not found, creating')
        await createTable({
            TableName: migrationTableName,
            AttributeDefinitions: [
                {
                    AttributeName: 'migrationId',
                    AttributeType: 'N',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'migrationId',
                    KeyType: 'HASH',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        })
        await writeMigrationInfo(1, 'Migration table')
    }
}

async function writeMigrationInfo(id: number, name: string) {
    await dynamodb
        .putItem({
            TableName: migrationTableName,
            Item: {
                migrationId: {
                    N: `${id}`,
                },
                name: {
                    S: name,
                },
            },
        })
        .promise()
}

async function listMigrations() {
    return await dynamodb
        .scan({
            TableName: migrationTableName,
            Select: 'ALL_ATTRIBUTES',
        })
        .promise()
    // return await dynamodb.query({
    //     TableName: 'migrations',
    //     KeyConditionExpression: 'prefix = :prefix',
    //     ExpressionAttributeValues: {
    //         ":prefix": {
    //             S: global.tablePrefix
    //         }
    //     }
    // }).promise()
}

function getLastMigrationId(
    migrationList: PromiseResult<AWS.DynamoDB.ScanOutput, AWS.AWSError>
) {
    const migrationIds = migrationList.Items.map(i =>
        Math.max(
            ...Object.values(i.migrationId).map(i => Number.parseInt(i, 10))
        )
    )
    return Math.max(...migrationIds)
}

async function initMigrations() {
    await createMigrationTable()
    const migrations = await listMigrations()
    console.log(`All migrations: ${JSON.stringify(migrations)}`)
    const lastMigration = getLastMigrationId(migrations)
    console.log(`Last migration: ${lastMigration}`)
    return lastMigration
}

initMigrations()
