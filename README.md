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
10 * * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/clips' 'pastHourTotalUniquePageviews'
40 1 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/clips' 'pastDayTotalUniquePageviews'
40 2 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/clips' 'pastWeekTotalUniquePageviews'
40 3 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/clips' 'pastMonthTotalUniquePageviews'
40 4 * * 0 ~/webapps/podverse_web/bin/queryUniquePageviews '~/clips' 'pastYearTotalUniquePageviews'
40 5 * * 0 ~/webapps/podverse_web/bin/queryUniquePageviews '~/clips' 'allTimeTotalUniquePageviews'

20 * * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/episodes' 'pastHourTotalUniquePageviews'
50 1 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/episodes' 'pastDayTotalUniquePageviews'
50 2 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/episodes' 'pastWeekTotalUniquePageviews'
50 3 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/episodes' 'pastMonthTotalUniquePageviews'
50 4 * * 0 ~/webapps/podverse_web/bin/queryUniquePageviews '~/episodes' 'pastYearTotalUniquePageviews'
50 5 * * 0 ~/webapps/podverse_web/bin/queryUniquePageviews '~/episodes' 'allTimeTotalUniquePageviews'

30 * * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/podcasts' 'pastHourTotalUniquePageviews'
0 1 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/podcasts' 'pastDayTotalUniquePageviews'
0 2 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/podcasts' 'pastWeekTotalUniquePageviews'
0 3 * * * ~/webapps/podverse_web/bin/queryUniquePageviews '~/podcasts' 'pastMonthTotalUniquePageviews'
0 4 * * 0 ~/webapps/podverse_web/bin/queryUniquePageviews '~/podcasts' 'pastYearTotalUniquePageviews'
0 5 * * 0 ~/webapps/podverse_web/bin/queryUniquePageviews '~/podcasts' 'allTimeTotalUniquePageviews'


````
