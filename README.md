# Nextjs-cloud-template

This is a template for Next.js projects using only managed cloud services:

-   Language: Typescript
-   Frontend: Next.js, React
-   Hosting: Zeit Now
-   Backend: Zeit Now serverless
-   Database: AWS DynamoDb
-   Authentication: Firebase auth
-   Error logging: Sentry

All of the services here have generous free tiers, so this should be quite suitable for hobby projects.

# Installation

You need to register for several cloud services to use this template.

### Environment variables

Secrets are stored in environment variables. For production, these should be added to Now Secrets:

```
now secrets add env_var value
```

You can customize the now secret names in now.json, for example if you have multiple projects with the same variable names.

In development, you should create in the project folder root files _.env_ containing the runtime variables and _.env.build_ for build-time variables. See _.env.example_ and _.env.build.example_ for the required variables. Note that some variables are added to the client-side bundle from the build-time variables.

## Zeit Now

Install Now globally:

```
npm i -g now
```

Authenticate / register with

```
now login
```

Deploy with

```
now
```

This template relies on the Github integration, so you should set up in the zeit.co website by adding the repo there.

## AWS Dynamodb

You can use Dynamodb in the cloud or you can install a local version for development. The deployment process will run the migration files in the migrations folder. Each different branch in Github will have their own tables created in Dynamodb, using the getTablePrefix function.

### Production

You need an AWS account and to set up your credentials. You should set now secrets _db_key_id_ to your AWS credential key id and _db_key_ to AWS credential key.

For your own project, you should also modify the table name prefix to your own choice in config/config.ts getTablePrefix function.

### Development

You should install a local Dynamodb version for your local development.

-   Install Java. https://www.oracle.com/technetwork/java/javase/downloads/jdk13-downloads-5672538.html
-   Download dynamodb and put it to directory "dynamodb" under this project. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
-   Run the local db by
    ```
    npm run start-db
    ```

## Firebase

Firebase is used to handle the authentication. This template includes the email and Google sign ins, but it shouldn't be too hard to add more.

-   Register to Firebase and create a new project in the [Firebase console.](https://console.firebase.google.com/)
-   Add Authentication to the project, enabling email and Google sign in.
-   Add your domain to the Authorized domains
-   Register a new web app for your project. You should get a config json. Modify this to one line, add it to .env.build FIREBASE_CLIENT_CONFIG and to now secrets.
-   Create a service account in Firebase console project settings. Generate a new private key json. Modify this to one line, add it to .env FIREBASE_ADMIN_CONFIG and to now secrets.

## Sentry

Exceptions in your applications are sent to Sentry. When you push your code to Github, the deployment will create new deployments to Sentry and upload the created source maps. This will hopefully allow us to find out in which commit the bug was created.

Setup:

-   Register to [Sentry](https://sentry.io)
-   Create a new project
-   Save your dsn to SENTRY_DSN variable in .env and .env.build and to Now secrets
-   Install Github integration
-   Go to Settings > Account > API > Auth Tokens in Sentry console and add a new API key. Save the key to SENTRY_AUTH_TOKEN variable in .env.build and Now secrets.
-   Set up your variables SENTRY_ORG, SENTRY_PROJECT and SENTRY_REPO in .env.build and Now secrets.
