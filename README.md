#podverse-web#

Web app for the Podverse podcast clip sharing system

---

## Tests

You need to have docker available.

Run `scripts/postgres-ci.sh start` to start postgres on `localhost:5432`.

Then run `npm test`

###Setup instructions###

source init_env.sh

npm install

node app.js

open localhost:8080 in your browser
