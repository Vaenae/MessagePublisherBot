import AWS from 'aws-sdk'
import { config } from '../config/config'

const localOptions = { region: 'localhost', endpoint: 'http://localhost:8000' }
const remoteOptions = { region: config.region }

if (!config.useLocalDb && config.db_key != null && config.db_key_id != null) {
    console.log('Using credentials from secrets')
    const credentials = new AWS.Credentials({
        accessKeyId: config.db_key_id,
        secretAccessKey: config.db_key
    })
    AWS.config.update({
        credentials,
        region: config.region
    })
} else {
    console.log('Not using credentials from secrets')
}

console.log('useLocalDb: ' + config.useLocalDb)

export const dynamodb = config.useLocalDb
    ? new AWS.DynamoDB(localOptions)
    : new AWS.DynamoDB(remoteOptions)
