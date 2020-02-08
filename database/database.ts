import AWS from 'aws-sdk'
import { getServerConfig } from '../config/config'
const serverConfig = getServerConfig()

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
