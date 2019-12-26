export type FirebaseClientConfig = Object

interface Secrets {
    db_key_id?: string
    db_key?: string
}

export interface ServerConfig extends Secrets {
    tablePrefix: string
    useLocalDb: boolean
    region: string
}

export interface ClientConfig {
    firebaseClientConfig: FirebaseClientConfig
    sentryDsn: string
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

export const serverConfig: ServerConfig = {
    ...getSecrets(),
    useLocalDb: getUseLocalDb(),
    tablePrefix: getTablePrefix(),
    region: 'eu-north-1'
}

export const clientConfig: ClientConfig = {
    firebaseClientConfig: JSON.parse(process.env.FIREBASE_CLIENT_CONFIG),
    sentryDsn: process.env.SENTRY_DSN
}
