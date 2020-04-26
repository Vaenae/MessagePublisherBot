import AWS from 'aws-sdk'
import { getServerConfig } from '../config/config'
const serverConfig = getServerConfig()
import { CreateTableInput } from 'aws-sdk/clients/dynamodb'

const localOptions = { region: 'localhost', endpoint: 'http://localhost:8000' }
const remoteOptions = { region: serverConfig.region }

if (
    !serverConfig.useLocalDb &&
    serverConfig.dbKey != null &&
    serverConfig.dbKeyId != null
) {
    console.log('Using credentials from secrets')
    const credentials = new AWS.Credentials({
        accessKeyId: serverConfig.dbKeyId,
        secretAccessKey: serverConfig.dbKey
    })
    AWS.config.update({
        credentials,
        region: serverConfig.region
    })
} else {
    console.log('Not using credentials from secrets')
}

console.log('useLocalDb: ' + serverConfig.useLocalDb)

export const dynamodb = serverConfig.useLocalDb
    ? new AWS.DynamoDB(localOptions)
    : new AWS.DynamoDB(remoteOptions)

export async function listTables() {
    return await dynamodb
        .listTables()
        .promise()
        .then((data) => data.TableNames || [])
}

export async function createTable(table: CreateTableInput) {
    const result = await dynamodb.createTable(table).promise()
    console.log(result.TableDescription)
    await dynamodb
        .waitFor('tableExists', { TableName: table.TableName })
        .promise()
    return result
}

export async function deleteTable(tableName: string) {
    try {
        await dynamodb.deleteTable({ TableName: tableName }).promise()
        await dynamodb
            .waitFor('tableNotExists', { TableName: tableName })
            .promise()
    } catch (error) {
        console.error(error)
    }
}
