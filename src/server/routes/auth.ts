import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/reset-password', async ctx => {
    await app.render(ctx.req, ctx.res, '/reset-password', ctx.query)
  })

  router.get('/verify-email', async ctx => {
    await app.render(ctx.req, ctx.res, '/verify-email', ctx.query)
  })
  
  return router
}
