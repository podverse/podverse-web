#podverse-web#

Web app for the Podverse podcast clip sharing system

---

## Tests

You need to have docker available.

Run `scripts/postgres-ci.sh start` to start postgres on `localhost:5432`.

Then run `npm test`

### Setup instructions

```shell
source init_env.sh

npm install

npm start
```

open localhost:8080 in your browser

### Migrate DB

`npm run migrate`
