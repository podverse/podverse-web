import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()
  const handle = app.getRequestHandler()

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
  })

  return router
}