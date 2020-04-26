const Router = require('koa-router')

export default (app) => {
  const router = new Router()

  router.get('/coupon/:id', async ctx => {
    const query = { ...ctx.params }
    await app.render(ctx.req, ctx.res, '/coupon', query)
  })

  return router
}
