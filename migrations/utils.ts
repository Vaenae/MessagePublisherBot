import AWS from 'aws-sdk'
import { CreateTableInput } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { global } from '../config/config'

export interface Migration {
    name: string
    migrate: () => Promise<void>
}
var options = { region: 'localhost', endpoint: 'http://localhost:8000' }
var dynamodb = new AWS.DynamoDB(options)

export async function listTables() {
    return await dynamodb
        .listTables()
        .promise()
        .then(data => data.TableNames)
}

export async function createTable(table: CreateTableInput) {
    const result = await dynamodb.createTable(table).promise()
    console.log(result.TableDescription)
}

export const migrationTableName = `${global.tablePrefix}-migrations`

export async function writeMigrationInfo(id: number, name: string) {
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

export async function listMigrations() {
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

export function getLastMigrationId(
    migrationList: PromiseResult<AWS.DynamoDB.ScanOutput, AWS.AWSError>
) {
    const migrationIds = migrationList.Items.map(i =>
        Math.max(
            ...Object.values(i.migrationId).map(i => Number.parseInt(i, 10))
        )
    )
    return Math.max(...migrationIds)
}
