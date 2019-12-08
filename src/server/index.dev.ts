require('dotenv').config({ path: '.env' }) // use .env in index.dev.ts only

// eslint-disable-next-line import/first
import { authRouter, infoRouter, mainRouter, paymentRouter, requestHandlerRouter } from './routes'
  
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const next = require('next')

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

    server.use(authRouter(app).routes())
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

