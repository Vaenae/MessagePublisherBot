export type FirebaseClientConfig = {}

interface Secrets {
    dbKeyId?: string
    dbKey?: string
}

export interface ServerConfig extends Secrets {
    tablePrefix: string
    useLocalDb: boolean
    region: string
}

export interface ClientConfig {
    firebaseClientConfig: FirebaseClientConfig
    sentryDsn?: string
}

function getUseLocalDb() {
    return process.env.USE_REMOTE_DB !== 'true'
}

function getTablePrefix() {
    const branchName = process.env.NOW_GITHUB_COMMIT_REF
    return branchName != null
        ? // Only use allowed dynamodb table name chars
          // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html
          `nextjs-cloud-template-${branchName.replace(/[^-_.\w]/g, '_')}`
        : 'nextjs-cloud-template'
}

function getSecrets(): Secrets {
    return {
        dbKeyId: process.env.DB_KEY_ID,
        dbKey: process.env.DB_KEY
    }
}

export const serverConfig: ServerConfig = {
    ...getSecrets(),
    useLocalDb: getUseLocalDb(),
    tablePrefix: getTablePrefix(),
    region: 'eu-north-1'
}

export const clientConfig: ClientConfig = {
    firebaseClientConfig: JSON.parse(
        process.env.FIREBASE_CLIENT_CONFIG || '{}'
    ),
    sentryDsn: process.env.SENTRY_DSN
}
