interface Secrets {
    aws_access_key_id?: string
    aws_secret_access_key?: string
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
        aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
        aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
    }
}

export const config: Config = {
    ...getSecrets(),
    useLocalDb: getUseLocalDb(),
    tablePrefix: getTablePrefix(),
    region: 'eu-north-1'
}
