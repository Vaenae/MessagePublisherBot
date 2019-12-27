echo $SENTRY_RELEASE
echo $NOW_GITHUB_COMMIT_SHA
./node_modules/.bin/sentry-cli releases files $NOW_GITHUB_COMMIT_SHA upload-sourcemaps .next
