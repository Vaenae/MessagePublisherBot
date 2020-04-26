import { PromiseResult } from 'aws-sdk/lib/request'
import { getServerConfig } from '../../config/config'
import { dynamodb } from '../database'

export interface Migration {
    name: string
    migrate: () => Promise<void>
}

export const migrationTableName = `${getServerConfig().tablePrefix}-migrations`

export async function writeMigrationInfo(id: number, name: string) {
    await dynamodb
        .putItem({
            TableName: migrationTableName,
            Item: {
                migrationId: {
                    N: `${id}`
                },
                name: {
                    S: name
                }
            }
        })
        .promise()
}

export async function listMigrations() {
    return await dynamodb
        .scan({
            TableName: migrationTableName,
            Select: 'ALL_ATTRIBUTES'
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
    const migrationIds = (migrationList.Items || []).map((i) =>
        Math.max(
            ...Object.values(i.migrationId).map((i) => Number.parseInt(i, 10))
        )
    )
    return Math.max(...migrationIds)
}
