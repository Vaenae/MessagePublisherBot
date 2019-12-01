import AWS from 'aws-sdk'
import { config } from '../config/config'

const localOptions = { region: 'localhost', endpoint: 'http://localhost:8000' }
const remoteOptions = { region: config.region }

export const dynamodb = config.useLocalDb
    ? new AWS.DynamoDB(localOptions)
    : new AWS.DynamoDB(remoteOptions)
