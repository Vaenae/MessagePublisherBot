import AWS from 'aws-sdk'
import { serverConfig } from '../config/config'

const localOptions = { region: 'localhost', endpoint: 'http://localhost:8000' }
const remoteOptions = { region: serverConfig.region }

if (
    !serverConfig.useLocalDb &&
    serverConfig.db_key != null &&
    serverConfig.db_key_id != null
) {
    console.log('Using credentials from secrets')
    const credentials = new AWS.Credentials({
        accessKeyId: serverConfig.db_key_id,
        secretAccessKey: serverConfig.db_key
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
