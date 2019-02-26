require('dotenv').config({ path: '.env' }) // use .env in index.dev.ts only

import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as helmet from 'koa-helmet'
import * as next from 'next'
import { adminRouter, authRouter, devRouter, infoRouter, mainRouter,
  paymentRouter, requestHandlerRouter } from './routes'

const dev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
const app = next({ dev })

app.prepare()
  .then(() => {
    const server = new Koa()

    server.use(helmet())
    server.use(bodyParser())
    
    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })

    server.use(adminRouter(app).routes())
    server.use(authRouter(app).routes())
    server.use(devRouter(app).routes())
    server.use(infoRouter(app).routes())
    server.use(mainRouter(app).routes())
    server.use(paymentRouter(app).routes())
    server.use(requestHandlerRouter(app).routes())
    
    // Config is only available after Next.js has started
    const { PORT } = require(process.cwd() + '/src/config/index.ts').default()

    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`)
    })
  })

