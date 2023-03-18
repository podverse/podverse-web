# Podverse Web

## Languages

Translations are greatly appreciated! If you would like to help translate Podverse, please visit our [Weblate page](https://hosted.weblate.org/projects/podverse/podverse-web/).

<a href="https://hosted.weblate.org/engage/podverse/">
<img style="margin-bottom: -55px;" src="https://hosted.weblate.org/widgets/podverse/-/podverse-web/horizontal-auto.svg" alt="Translation status" />
</a>

## About

Podverse is a FOSS podcast manager for iOS, Android, F-Droid, and web that supports [Podcasting 2.0](https://medium.com/@everywheretrip/an-introduction-to-podcasting-2-0-3c4f61ea17f4) and [value for value](https://value4value.info/) features.

Features of this web app include:

- subscribe to podcasts
- audio playback
- video playback
- livestream playback
- boosts
- chapters
- cross-app comments
- transcripts
- create and share clips
- create and share playlists
- create a listener profile
- subscribe to listener profiles
- screen-reader accessibility

## Getting started

To run Podverse web locally:

1) have node >= 16 installed
2) create a .env file
3) install node modules
4) run the app
5) open localhost:3000 in your browser

To create a .env file, copy the `.env.local-prod-data.example` file in this directory, and rename it to `.env`. The default values in this file will set the web app to load prod data from <api.podverse.fm>. You can change it later to use a [local database](https://github.com/podverse/podverse-ops/blob/master/Makefile#L45) and [API](https://github.com/podverse/podverse-api).

To install the node modules, run:

```bash
npm install
```

Then, to run the app:

```bash
npm run dev
```

Then open a web browser and go to <http://localhost:3000>.

## Git History

### Ignore linter-only commits rules in Git history

If you'd like to ignore noisy linter-only commits in your Git history, we have a `.git-blame-ignore-revs` file that can filter out problematic commits that were the result of ONLY doing lint fixes. Your local machine can be configured to use that file as a list of commits that should be ignored while doing blames and showing inline file history.

This can be configured by running:

```sh
git config --global blame.ignoreRevsFile .git-blame-ignore-revs
```

Which was taken from <https://michaelheap.com/git-ignore-rev/>.

## Contact

We can be reached in our [Matrix space](https://matrix.to/#/#podverse-space:matrix.org) (preferred), [Discord channel](https://discord.gg/6HkyNKR), or by emailing <contact@podverse.fm>.
