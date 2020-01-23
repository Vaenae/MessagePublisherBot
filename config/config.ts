interface Secrets {
    dbKeyId: string
    dbKey: string
    botToken: string
}

export interface ServerConfig extends Secrets {
    tablePrefix: string
    useLocalDb: boolean
    region: string
}

export interface ClientConfig {
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
          `message-publisher-bot-${branchName.replace(/[^-_.\w]/g, '_')}`
        : 'message-publisher-bot'
}

function getSecrets(): Secrets {
    return {
        dbKeyId: process.env.DB_KEY_ID!,
        dbKey: process.env.DB_KEY!,
        botToken: process.env.BOT_TOKEN!
    }
}

export const serverConfig: ServerConfig = {
    ...getSecrets(),
    useLocalDb: getUseLocalDb(),
    tablePrefix: getTablePrefix(),
    region: 'eu-north-1'
}

export const clientConfig: ClientConfig = {
    sentryDsn: process.env.SENTRY_DSN
}
