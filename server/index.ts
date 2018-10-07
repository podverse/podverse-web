import { createServer } from 'http'
import { parse } from 'url'
import * as next from 'next'
import { routeFilePaths, routePagePaths } from 'lib/constants'

// @ts-ignore
const port = parseInt(process.env.PORT, 10) || 3000 
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    createServer((req, res) => {
      // @ts-ignore
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl
      
      if (pathname === routePagePaths.MAIN.CLIP) {
        app.render(req, res, routeFilePaths.MAIN.CLIP, query)
      } else if (pathname === routePagePaths.MAIN.CLIPS) {
        app.render(req, res, routeFilePaths.MAIN.CLIPS, query)
      } else {
        handle(req, res, parsedUrl)
      }
    })
    .listen(port, err => {
      if (err) throw err
      console.log(`>Ready on http://localhost:${port}`)
    })
  })

