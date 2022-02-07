This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Translations on Hosted Weblate

<a href="https://hosted.weblate.org/engage/podverse/">
<img src="https://hosted.weblate.org/widgets/podverse/-/podverse-web/horizontal-auto.svg" alt="Translation status" />
</a>

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). \
This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. \
Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) — your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Development Flow

### Hey the formatting and lint rules are messing with my Git history

Yeah, as we evolve our coding standards and practices that will happen as we keep everything as up to date as possible, sorry :( \
Luckily, there is a fix! We have a `.git-blame-ignore-revs` file that calls out specific problematic commits that were the result of ONLY doing lint fixes and you're local machine can be configured to use that file as a list of commits that should be ignored while doing blames and showing inline file history. \
This can be configured by running

```sh
git config --global blame.ignoreRevsFile .git-blame-ignore-revs
```

Which was taken from <https://michaelheap.com/git-ignore-rev/>
