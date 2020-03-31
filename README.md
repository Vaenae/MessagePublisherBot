# MessagePublisherBot

A [Telegram](https://telegram.org/) bot that publishes group messages on a web page.

### Tech

-   Language: Typescript
-   Frontend: Next.js, React
-   Telegram connectivity: [Telegraf](https://telegraf.js.org)
-   Hosting: Zeit Now
-   Database: AWS DynamoDb
-   Error logging: Sentry

# Usage

Invite @MessagePublisherBot to your group as an administrator. The bot will only see all the messages if it has administrator permissions.

Command /publish on the group will generate a random url where the messages will be published.

Command /unpublish will remove the previously published url.

# Installation

If you want to install your own version of the bot, you can fork this repo and use your own accounts for hosting.

## Telegram

See (https://core.telegram.org/bots) on how to register your bot.

## Zeit Now

The bot is hosted on Zeit now.

The code relies on the Github integration (the publish scripts use the github commit id), so you should set up in the zeit.com website by adding the repo there.

## Environment variables

Secrets are stored in environment variables. For production, these should be added to Now Secrets:

```
now secrets add env_var value
```

The bot needs the following secrets to be set up:

- DB_KEY_ID: Your AWS credentials key id
- DB_KEY: Your AWS credentials key
- USE_REMOTE_DB: Use DynamoDB on AWS, not a local version
- SENTRY_DSN: Your Sentry DSN
- SENTRY_AUTH_TOKEN: Your sentry auth token. Used in the build phase.
- SENTRY_ORG: Your sentry organization
- SENTRY_PROJECT: Your sentry project
- SENTRY_REPO: Your sentry repo
- BOT_TOKEN: Telegram bot token you got from Botfather
- URL_PROD: The URL under which your groups will be published.

## Scripts

The following scripts are defined in package.json:

- build: Builds the code, runs database migrations, registers the webhook on Telegram and sends the source maps to Sentry.
- start-db: Starts the local DynamoDB if you have copied it to ./dynamodb/DynamoDBLocal.jar
- migrations: Creates DynamoDB tables
- lint: Runs ESLint
- register-webhook: Registers the published bot webhook in Telegram
- clear-database: Clears the local database
- test: clears the local database and runs tests
