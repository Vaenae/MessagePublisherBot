./node_modules/.bin/sentry-cli releases new $NOW_GITHUB_COMMIT_SHA 
./node_modules/.bin/sentry-cli releases set-commits --commit $SENTRY_REPO"@"$NOW_GITHUB_COMMIT_SHA $NOW_GITHUB_COMMIT_SHA 
./node_modules/.bin/sentry-cli releases files $NOW_GITHUB_COMMIT_SHA upload-sourcemaps .next --url-prefix '~/_next' --rewrite
