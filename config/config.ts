interface Secrets {
    db_key_id?: string
    db_key?: string
}

export interface Config extends Secrets {
    tablePrefix: string
    useLocalDb: boolean
    region: string
}

function getUseLocalDb() {
    return process.env.USE_REMOTE_DB !== 'true'
}

function getTablePrefix() {
    return process.env.NOW_GITHUB_COMMIT_REF != null
        ? `rescal-${process.env.NOW_GITHUB_COMMIT_REF}`
        : 'rescal'
}

function getSecrets(): Secrets {
    return {
        db_key_id: process.env.DB_KEY_ID,
        db_key: process.env.DB_KEY
    }
}

export const config: Config = {
    ...getSecrets(),
    useLocalDb: getUseLocalDb(),
    tablePrefix: getTablePrefix(),
    region: 'eu-north-1'
}
