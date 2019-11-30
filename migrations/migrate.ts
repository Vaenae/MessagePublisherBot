import AWS from 'aws-sdk'
import * as dm from 'dynamodb-migrations'
import { global } from '../config/config'
import * as path from 'path'

var options = { region: 'localhost', endpoint: 'http://localhost:8000' }
var dynamodb = {
    raw: new AWS.DynamoDB(options),
    doc: new AWS.DynamoDB.DocumentClient(options),
}

function create(name: string) {
    dm.create(name)
}

function run() {
    dm.executeAll({
        tablePrefix: `${global.tablePrefix}-`,
    })
}

var [command, name] = process.argv.slice(2)
var absolutePath = path.resolve('migrations')
dm.init(dynamodb, absolutePath)
if (command === 'create') {
    create(name)
} else if (command === 'run') {
    run()
}
