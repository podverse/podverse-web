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

### Google Core Reporting API cron job for unique pageview counts*

podverse-web currently runs parsing with the following commands:

````
10 * * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/clips' 'pastHourTotalUniquePageviews'
40 1 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/clips' 'pastDayTotalUniquePageviews'
40 2 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/clips' 'pastWeekTotalUniquePageviews'
40 3 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/clips' 'pastMonthTotalUniquePageviews'
40 4 * * 0 docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/clips' 'pastYearTotalUniquePageviews'
40 5 * * 0 docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/clips' 'allTimeTotalUniquePageviews'

20 * * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/episodes' 'pastHourTotalUniquePageviews'
50 1 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/episodes' 'pastDayTotalUniquePageviews'
50 2 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/episodes' 'pastWeekTotalUniquePageviews'
50 3 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/episodes' 'pastMonthTotalUniquePageviews'
50 4 * * 0 docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/episodes' 'pastYearTotalUniquePageviews'
50 5 * * 0 docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/episodes' 'allTimeTotalUniquePageviews'

30 * * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/podcasts' 'pastHourTotalUniquePageviews'
0 1 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/podcasts' 'pastDayTotalUniquePageviews'
0 2 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/podcasts' 'pastWeekTotalUniquePageviews'
0 3 * * * docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/podcasts' 'pastMonthTotalUniquePageviews'
0 4 * * 0 docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/podcasts' 'pastYearTotalUniquePageviews'
0 5 * * 0 docker run --rm podverse_stats podverse_web_dev node ~/podverse-web/scripts/queryUniquePageviews.js '~/podcasts' 'allTimeTotalUniquePageviews'
````
