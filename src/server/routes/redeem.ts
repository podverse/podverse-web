const Router = require('koa-router')

export default (app) => {
  const router = new Router()

  router.get('/redeem/:id', async ctx => {
    const query = { ...ctx.params }
    await app.render(ctx.req, ctx.res, '/redeem', query)
  })

  return router
}
