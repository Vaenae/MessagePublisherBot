import {
    listTables,
    createTable,
    migrationTableName,
    writeMigrationInfo,
    listMigrations,
    getLastMigrationId,
    Migration
} from './utils'
import { createUsersMigration } from './1-create-users'

// var args = process.argv.slice(2)

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
                    AttributeType: 'N'
                }
            ],
            KeySchema: [
                {
                    AttributeName: 'migrationId',
                    KeyType: 'HASH'
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        })
        await writeMigrationInfo(1, 'Migration table')
    }
}

async function initMigrations() {
    await createMigrationTable()
    const migrations = await listMigrations()
    console.log(`All migrations: ${JSON.stringify(migrations)}`)
    const lastMigration = getLastMigrationId(migrations)
    console.log(`Last migration: ${lastMigration}`)
    return lastMigration
}

const migrations: Record<number, Migration> = {
    2: createUsersMigration
}

async function runMigrations() {
    const lastMigration = await initMigrations()
    Object.entries(migrations).forEach(async ([id, migration]) => {
        const idNumber = Number.parseInt(id)
        if (idNumber > lastMigration) {
            await migration.migrate()
            await writeMigrationInfo(idNumber, migration.name)
        }
    })
}

runMigrations().catch(error => {
    console.error(error)
    process.exit(1)
})
